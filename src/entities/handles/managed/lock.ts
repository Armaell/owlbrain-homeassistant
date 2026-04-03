import { LockEntity, type LockState } from "../single/lock"
import { BaseEntityHandle, type EntityRef } from "../single/base-handle"
import { ManagedEntity } from "./base-mixin"

export function managedLockEntity(ref: string | EntityRef | any): ManagedLock {
	if (typeof ref === "string") {
		return new ManagedLock({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ManagedLock(ref)
	} else {
		return new ManagedLock(BaseEntityHandle.fromScriptInstance(ref))
	}
}

class ManagedLock extends ManagedEntity<typeof LockEntity, LockState>(
	LockEntity
) {}
