import { CoverEntity, type CoverState } from "../single/cover"
import { BaseEntityHandle, type EntityRef } from "../single/base-handle"
import { ManagedEntity } from "./base-mixin"

export function managedCoverEntity(
	ref: string | EntityRef | any
): ManagedCover {
	if (typeof ref === "string") {
		return new ManagedCover({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ManagedCover(ref)
	} else {
		return new ManagedCover(BaseEntityHandle.fromScriptInstance(ref))
	}
}

class ManagedCover extends ManagedEntity<typeof CoverEntity, CoverState>(
	CoverEntity
) {}
