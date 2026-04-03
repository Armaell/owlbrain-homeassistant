import { VacuumEntity, type VacuumState } from "../single/vacuum"
import { BaseEntityHandle, type EntityRef } from "../single/base-handle"
import { ManagedEntity } from "./base-mixin"

export function managedVacuumEntity(
	ref: string | EntityRef | any
): ManagedVacuum {
	if (typeof ref === "string") {
		return new ManagedVacuum({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ManagedVacuum(ref)
	} else {
		return new ManagedVacuum(BaseEntityHandle.fromScriptInstance(ref))
	}
}

class ManagedVacuum extends ManagedEntity<typeof VacuumEntity, VacuumState>(
	VacuumEntity
) {}
