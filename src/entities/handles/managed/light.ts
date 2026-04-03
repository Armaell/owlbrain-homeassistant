import { LightEntity, type LightState } from "../single/light"
import { BaseEntityHandle, type EntityRef } from "../single/base-handle"
import { ManagedEntity } from "./base-mixin"

export function managedLightEntity(
	ref: string | EntityRef | any
): ManagedLight {
	if (typeof ref === "string") {
		return new ManagedLight({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ManagedLight(ref)
	} else {
		return new ManagedLight(BaseEntityHandle.fromScriptInstance(ref))
	}
}

class ManagedLight extends ManagedEntity<typeof LightEntity, LightState>(
	LightEntity
) {}
