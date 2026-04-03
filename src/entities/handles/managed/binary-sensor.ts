import { BaseEntityHandle, type EntityRef } from "../single/base-handle"
import {
	BinarySensorEntity,
	type BinarySensorState
} from "../single/binary-sensor"
import { ManagedEntity } from "./base-mixin"

export function managedBinarySensorEntity(
	ref: string | EntityRef | any
): ManagedBinarySensor {
	if (typeof ref === "string") {
		return new ManagedBinarySensor({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ManagedBinarySensor(ref)
	} else {
		return new ManagedBinarySensor(BaseEntityHandle.fromScriptInstance(ref))
	}
}

class ManagedBinarySensor extends ManagedEntity<
	typeof BinarySensorEntity,
	BinarySensorState
>(BinarySensorEntity) {}
