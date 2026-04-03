import { ClimateEntity, type ClimateState } from "../single/climate"
import { BaseEntityHandle, type EntityRef } from "../single/base-handle"
import { ManagedEntity } from "./base-mixin"

export function managedClimateEntity(
	ref: string | EntityRef | any
): ManagedClimate {
	if (typeof ref === "string") {
		return new ManagedClimate({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ManagedClimate(ref)
	} else {
		return new ManagedClimate(BaseEntityHandle.fromScriptInstance(ref))
	}
}

class ManagedClimate extends ManagedEntity<typeof ClimateEntity, ClimateState>(
	ClimateEntity
) {}
