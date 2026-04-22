import type { Connection } from "home-assistant-js-websocket"
import type { HomeAssistantIntegrationResolvedConfig } from "../integration"
import type {
	CompanionDeleteDevice,
	CompanionDeleteEntity,
	CompanionDevice,
	CompanionEntity,
	CompanionListAllResponse,
	CompanionUpdateEntityState,
	CompanionUpsertDevice,
	CompanionUpsertEntity,
	CompanionUpsertResponse
} from "./companion.types"
import { CompanionNotAvailableError } from "../errors"

/**
 * All commands available with the companion app
 */
export class WebsocketToCompanion {
	constructor(
		private config: HomeAssistantIntegrationResolvedConfig,
		private conn: Connection
	) {}

	private async sendMessagePromise<R>(
		...args: Parameters<typeof this.conn.sendMessagePromise>
	): Promise<R> {
		try {
			return await this.conn.sendMessagePromise(...args)
		} catch (e: any) {
			if (e.code === "unknown_command")
				throw new CompanionNotAvailableError({ namespace: [this.config.name] })
			throw e
		}
	}

	async listAll(): Promise<CompanionListAllResponse> {
		return this.sendMessagePromise({
			type: "owlbrain/list_devices",
			namespace: this.config.name
		})
	}

	async upsertDevice(
		args: CompanionUpsertDevice
	): Promise<CompanionUpsertResponse<CompanionDevice>> {
		return this.sendMessagePromise({
			type: "owlbrain/upsert_device",
			device_id: args.device_id.toLowerCase(),
			namespace: this.config.name,
			data: args
		})
	}

	async deleteDevice(args: CompanionDeleteDevice) {
		return this.sendMessagePromise({
			type: "owlbrain/delete_device",
			device_id: args.device_id.toLowerCase(),
			namespace: this.config.name
		})
	}

	async upsertEntity(
		args: CompanionUpsertEntity
	): Promise<CompanionUpsertResponse<CompanionEntity>> {
		return this.sendMessagePromise({
			type: "owlbrain/upsert_entity",
			entity_id: args.entity_id.toLowerCase(),
			namespace: this.config.name,
			data: args
		})
	}

	async updateEntityState(args: CompanionUpdateEntityState) {
		return this.sendMessagePromise({
			type: "owlbrain/update_entity_state",
			entity_id: args.entity_id.toLowerCase(),
			namespace: this.config.name,
			state: args.state
		})
	}

	async deleteEntity(args: CompanionDeleteEntity) {
		return this.sendMessagePromise({
			type: "owlbrain/delete_entity",
			entity_id: args.entity_id,
			namespace: this.config.name
		})
	}

	async clear() {
		return this.sendMessagePromise({
			type: "owlbrain/clear",
			namespace: this.config.name
		})
	}
}
