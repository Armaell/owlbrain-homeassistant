import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export function binarySensorEntity(
	ref: string | EntityRef | any
): BinarySensorEntity {
	if (typeof ref === "string") {
		return new BinarySensorEntity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new BinarySensorEntity(ref)
	} else {
		return new BinarySensorEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}
export type BinarySensorState = "on" | "off" | "unknown" | "unavailable"

export class BinarySensorEntity extends BaseEntityHandle<BinarySensorState> {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "binary_sensor"
		})
	}

	deviceClass(): string | undefined {
		return this.attributes?.device_class
	}
}
