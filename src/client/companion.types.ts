export interface CompanionUpsertDevice {
	device_id: string
	name?: string
	manufacturer?: string
	model?: string
	sw_version?: string
	hw_version?: string
	serial_number?: string
	configuration_url?: string
	area?: string
	mac_address?: string
}

export interface CompanionDeleteDevice {
	device_id: string
}

interface CompanionUpsertSharedEntity {
	device_id?: string
	name?: string
	icon?: string
	entity_category?: string
}

type SensorDeviceClass =
	| "temperature"
	| "humidity"
	| "pressure"
	| "power"
	| "energy"
	| "voltage"
	| "current"
	| "timestamp"

type SensorStateClass = "measurement" | "total" | "total_increasing"

export interface CompanionUpsertSensorEntity extends CompanionUpsertSharedEntity {
	entity_id: `sensor.${string}`
	device_class?: SensorDeviceClass
	state_class?: SensorStateClass
	suggested_display_precision?: number
}

type BinarySensorDeviceClass =
	| "battery"
	| "battery_charging"
	| "cold"
	| "connectivity"
	| "door"
	| "garage_door"
	| "gas"
	| "heat"
	| "light"
	| "lock"
	| "moisture"
	| "motion"
	| "moving"
	| "occupancy"
	| "opening"
	| "plug"
	| "power"
	| "presence"
	| "problem"
	| "running"
	| "safety"
	| "smoke"
	| "sound"
	| "tamper"
	| "update"
	| "vibration"
	| "window"

export interface CompanionUpsertBinarySensorEntity extends CompanionUpsertSharedEntity {
	entity_id: `binary_sensor.${string}`
	device_class?: BinarySensorDeviceClass
}

type SwitchDeviceClass = "outlet" | "switch"

export interface CompanionUpsertSwitchEntity extends CompanionUpsertSharedEntity {
	entity_id: `switch.${string}`
	device_class?: SwitchDeviceClass
}

type ButtonDeviceClass =
	| "restart"
	| "update"
	| "identify"
	| "pairing"
	| "config"
	| "diagnostic"
	| "factory_reset"
	| "safe_mode"
	| "shutdown"
	| "start"
	| "stop"

export interface CompanionUpsertButtonEntity extends CompanionUpsertSharedEntity {
	entity_id: `button.${string}`
	device_class?: ButtonDeviceClass
}

export interface CompanionUpsertSelectEntity extends CompanionUpsertSharedEntity {
	entity_id: `select.${string}`
	options: string[]
}

export type CompanionUpsertEntity =
	| CompanionUpsertSensorEntity
	| CompanionUpsertBinarySensorEntity
	| CompanionUpsertSelectEntity
	| CompanionUpsertSwitchEntity
	| CompanionUpsertButtonEntity

export interface CompanionUpdateEntityState {
	entity_id: string
	state: any
}

export interface CompanionDeleteEntity {
	entity_id: string
}

export interface CompanionDevice {
	id: string
	unique_id: string
}

export interface CompanionEntity {
	id: string
	unique_id: string
	state: any
	device_id?: string
}

export interface CompanionUpsertResponse<T> {
	action: "created" | "updated"
	data: T
}

export interface CompanionListAllResponse {
	devices: CompanionDevice[]
	entities: CompanionEntity[]
}
