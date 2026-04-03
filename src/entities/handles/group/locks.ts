import { type EntityTarget, isEntityTarget } from "../../types"
import { type LockState, lockEntity } from "../single/lock"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"

export function lockEntities(ref: EntityTarget | any): LockEntities {
	if (isEntityTarget(ref)) {
		return new LockEntities(ref)
	} else {
		return new LockEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

export class LockEntities extends BaseEntitiesHandle<LockState> {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => lockEntity({ entity_id: e.entity_id }))
	}

	lock() {
		return this.action("lock", "lock")
	}

	unlock() {
		return this.action("lock", "unlock")
	}
}
