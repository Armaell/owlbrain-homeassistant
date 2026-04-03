import { SensorEntity, type SensorState } from "../single/sensor"
import { BaseEntityHandle, type EntityRef } from "../single/base-handle"
import { ManagedEntity } from "./base-mixin"

export function managedSensorEntity(
	ref: string | EntityRef | any
): ManagedSensor {
	if (typeof ref === "string") {
		return new ManagedSensor({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ManagedSensor(ref)
	} else {
		return new ManagedSensor(BaseEntityHandle.fromScriptInstance(ref))
	}
}

class ManagedSensor extends ManagedEntity<typeof SensorEntity, SensorState>(
	SensorEntity
) {}
