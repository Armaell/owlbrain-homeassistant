import { PersonEntity, type PersonState } from "../single/person"
import { BaseEntityHandle, type EntityRef } from "../single/base-handle"
import { ManagedEntity } from "./base-mixin"

export function managedPersonEntity(
	ref: string | EntityRef | any
): ManagedPerson {
	if (typeof ref === "string") {
		return new ManagedPerson({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ManagedPerson(ref)
	} else {
		return new ManagedPerson(BaseEntityHandle.fromScriptInstance(ref))
	}
}

class ManagedPerson extends ManagedEntity<typeof PersonEntity, PersonState>(
	PersonEntity
) {}
