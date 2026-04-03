import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export function sensorEntity(ref: string | EntityRef | any): SensorEntity {
	if (typeof ref === "string") {
		return new SensorEntity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new SensorEntity(ref)
	} else {
		return new SensorEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}
export type SensorState = string

export class SensorEntity extends BaseEntityHandle<SensorState> {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "sensor"
		})
	}

	deviceClass(): string | undefined {
		return this.attributes?.device_class
	}
}
