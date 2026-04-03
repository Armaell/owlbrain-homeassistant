import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export type LockState = "locked" | "unlocked" | "unknown" | "unavailable"

export function lockEntity(ref: string | EntityRef | any): LockEntity {
	if (typeof ref === "string") {
		return new LockEntity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new LockEntity(ref)
	} else {
		return new LockEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}

export class LockEntity extends BaseEntityHandle<LockState> {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "lock"
		})
	}

	async lock() {
		return this.action("lock")
	}

	async unlock() {
		return this.action("unlock")
	}
}
