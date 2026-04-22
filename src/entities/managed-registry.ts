import type { Logger } from "owlbrain-core"
import type { HomeAssistantWebsocket } from "../client/websocket"
import { CompanionNotAvailableError } from "../errors"
import type {
	CompanionUpsertDevice,
	CompanionUpsertEntity
} from "../client/companion.types"

// device_id should not be visible, but using Omit<> break TS type discrimination
export type OwlManagedConfig =
	| (CompanionUpsertEntity & { device_id?: never })
	| (CompanionUpsertDevice & {
			entities: (CompanionUpsertEntity & { device_id?: never })[]
	  })

export class ManagedRegistry {
	private readonly logger: Logger

	private devices = new Map<string, CompanionUpsertDevice>()
	private entities = new Map<string, CompanionUpsertEntity>()
	private unsynced = new Set<{ id: string; type: "entity" | "device" }>()
	private websocket?: HomeAssistantWebsocket

	constructor(configs: OwlManagedConfig[], logger: Logger) {
		this.logger = logger.child(["entity", "managed-registry"])

		for (const config of configs) {
			if ("entity_id" in config && !("entities" in config)) {
				this.entities.set(config.entity_id, config)
				this.unsynced.add({ id: config.entity_id, type: "entity" })
				continue
			}

			if ("device_id" in config && "entities" in config && config.device_id) {
				this.devices.set(config.device_id, config as CompanionUpsertDevice)
				this.unsynced.add({ id: config.device_id, type: "device" })

				for (const entity of config.entities as CompanionUpsertEntity[]) {
					this.entities.set(entity.entity_id, {
						...entity,
						device_id: config.device_id
					})
					this.unsynced.add({ id: entity.entity_id, type: "entity" })
				}

				continue
			}
		}
	}

	setWebsocket(ws: HomeAssistantWebsocket) {
		this.websocket = ws
	}

	async sync() {
		const unsynced = Array.from(this.unsynced.values())
		for (const entry of unsynced) {
			const { id, type } = entry
			try {
				if (type === "entity") {
					const entity = this.entities.get(id)
					if (!entity) continue
					const result = await this.websocket?.companion?.upsertEntity(entity)
					if (result?.action === "created") {
						this.logger.debug("Created entity", entity.entity_id)
						if (result.data.id !== entity.entity_id)
							this.logger.warn(
								`Could not secure the requested entity_id ${entity.entity_id}. Got ${result.data.id} instead`
							)
						this.unsynced.delete(entry)
					} else if (result?.action === "updated") {
						this.unsynced.delete(entry)
					} else {
						this.logger.warn("Unknown response from the websocket", result)
					}
				}
				if (type === "device") {
					const device = this.devices.get(id)
					if (!device) continue
					const result = await this.websocket?.companion?.upsertDevice(device)
					if (result?.action === "created") {
						this.logger.debug("Created device", device.device_id)
						this.unsynced.delete(entry)
					} else if (result?.action === "updated") {
						this.unsynced.delete(entry)
					} else {
						this.logger.warn("Unknown response from the websocket", result)
					}
				}
			} catch (e) {
				if (e instanceof CompanionNotAvailableError) {
					this.logger.error(e.message)
					break
				}
				this.logger.error(
					`Error while trying to sync managed ${id} with home assistant`,
					e
				)
			}
		}
	}

	hasEntityId(entity_id: string) {
		return this.entities.has(entity_id)
	}
}
