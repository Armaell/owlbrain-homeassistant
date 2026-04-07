import type {
	HassEntity,
	HassEventBase,
	HassServiceTarget
} from "home-assistant-js-websocket"

export interface ClientConfig {
	baseUrl: string
	token: string
}

export interface HAStateChangedEvent extends HassEventBase {
	event_type: "state_changed"
	data: {
		entity_id: string
		old_state: HassEntity | null
		new_state: HassEntity | null
	}
}

export interface HAEntityRegistryCreatedEvent extends HassEventBase {
	event_type: "entity_registry_created"
	data: {
		entity_id: string
		entity_entry: EntityRegistryEntry
	}
}

export interface HAEntityRegistryUpdatedEvent extends HassEventBase {
	event_type: "entity_registry_updated"
	data: {
		entity_id: string
		changes: Partial<EntityRegistryEntry>
	}
}

export interface HAEntityRegistryRemovedEvent extends HassEventBase {
	event_type: "entity_registry_removed"
	data: {
		entity_id: string
	}
}

export interface HAAreaRegistryCreatedEvent extends HassEventBase {
	event_type: "area_registry_created"
	data: {
		area_id: string
		area: AreaRegistryEntry
	}
}

export interface HAAreaRegistryUpdatedEvent extends HassEventBase {
	event_type: "area_registry_updated"
	data: {
		area_id: string
		changes: Partial<AreaRegistryEntry>
	}
}

export interface HAAreaRegistryRemovedEvent extends HassEventBase {
	event_type: "area_registry_removed"
	data: {
		area_id: string
	}
}

export interface EntityRegistryEntry {
	id: string
	unique_id: string
	entity_id: string
	device_id: string | null
	area_id: string | null
	floor_id: string | null
	labels?: string[]
	name: string | null
	original_name: string | null
}

export interface AreaRegistryEntry {
	area_id: string
	name: string
	aliases: string[]
	floor_id: string | null
	icon: string | null
}

export type HAEntity = Partial<HassEntity> &
	EntityRegistryEntry & {
		area?: AreaRegistryEntry
	}

export interface ServiceCallResponse {
	id: number
	type: "result"
	success: boolean
	result: null
}

export interface ActionCall {
	domain: string
	service: string
	data?: Record<string, unknown>
	target: HassServiceTarget
	return_response?: boolean
}

export interface HaManagedEntity {
	entity_id: string
	device_id?: string
	name?: string
}
