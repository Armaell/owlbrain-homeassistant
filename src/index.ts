export {
	HomeAssistantIntegration,
	type HomeAssistantIntegrationConfig
} from "./integration"
export type { OwlEntityUpdatedEvent, OwlZoneChangedEvent } from "./types"
export { EntityScript } from "./decorators/entity"
export { OnStateChange, type OnStateConfig } from "./decorators/on-state-change"
export { OnZoneChange, type OnZoneConfig } from "./decorators/on-zone-change"
export { HomeAssistantClient } from "./client/client"
export * from "./errors"
export type { EntityTarget } from "./entities/types"
export * from "./entities/handles/single"
export * from "./entities/handles/group"
export * from "./entities/handles/managed"
export type {
	CompanionUpsertDevice as CompanionDevice,
	CompanionUpsertSensorEntity as CompanionSensorEntity,
	CompanionUpsertBinarySensorEntity as CompanionBinarySensorEntity,
	CompanionUpsertSwitchEntity as CompanionSwitchEntity,
	CompanionUpsertButtonEntity as CompanionButtonEntity,
	CompanionUpsertSelectEntity as CompanionSelectEntity
} from "./client/companion.types"
