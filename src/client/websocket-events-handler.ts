import type { EventBus } from "owlbrain-core"
import type {
	HAAreaRegistryCreatedEvent,
	HAAreaRegistryRemovedEvent,
	HAAreaRegistryUpdatedEvent,
	HAEntityRegistryCreatedEvent,
	HAEntityRegistryRemovedEvent,
	HAEntityRegistryUpdatedEvent,
	HAStateChangedEvent
} from "./types"
import type { HomeAssistantIntegrationResolvedConfig } from "../integration"
import type { OwlEntityUpdatedEvent, OwlZoneChangedEvent } from "../types"
import type { EntitiesCache } from "../entities/entities-cache"

export class WebsocketEventsHandler {
	constructor(
		private config: HomeAssistantIntegrationResolvedConfig,
		private entitiesCache: EntitiesCache,
		private eventBus: EventBus
	) {}

	public readonly handlers: Record<string, (ev: any) => Promise<void>> = {
		state_changed: async (ev: HAStateChangedEvent) => {
			this.entitiesCache.updateFromStateChangedEvent(ev)
			await this.eventBus.emit<OwlEntityUpdatedEvent>({
				namespace: this.config.name,
				name: "entity_updated",
				...ev,
				datetime: new Date(ev.time_fired)
			})
			await this.onZoneChange(ev)
		},

		entity_registry_created: async (ev: HAEntityRegistryCreatedEvent) =>
			this.entitiesCache.createFromEntityRegistryEvent(ev),

		entity_registry_updated: async (ev: HAEntityRegistryUpdatedEvent) =>
			this.entitiesCache.updateFromEntityRegistryEvent(ev),

		entity_registry_removed: async (ev: HAEntityRegistryRemovedEvent) =>
			this.entitiesCache.removeFromEntityRegistryEvent(ev),

		area_registry_created: async (ev: HAAreaRegistryCreatedEvent) =>
			this.entitiesCache.createFromAreaRegistryEvent(ev),

		area_registry_updated: async (ev: HAAreaRegistryUpdatedEvent) =>
			this.entitiesCache.updateFromAreaRegistryEvent(ev),

		area_registry_removed: async (ev: HAAreaRegistryRemovedEvent) =>
			this.entitiesCache.removeFromAreaRegistryEvent(ev)
	}

	/**
	 * If entity has changed zone, emit event
	 */
	private async onZoneChange(ev: HAStateChangedEvent) {
		const { entity_id, old_state, new_state } = ev.data
		const isDeviceTracker = entity_id.startsWith("device_tracker.")

		let fromZone = null
		if (old_state) {
			fromZone = isDeviceTracker
				? old_state.state
				: (old_state?.attributes?.zone ?? null)
		}
		const toZone =
			(isDeviceTracker ? new_state.state : new_state?.attributes?.zone) ?? null

		if (fromZone !== toZone) {
			await this.eventBus.emit<OwlZoneChangedEvent>({
				...ev,
				namespace: this.config.name,
				name: "zone_change",
				from: fromZone,
				to: toZone,
				datetime: new Date(ev.time_fired)
			})
		}
	}
}
