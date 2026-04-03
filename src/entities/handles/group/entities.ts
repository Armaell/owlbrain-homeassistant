import { type EntityTarget, isEntityTarget } from "../../types"
import { entity } from "../single/entity"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"

export function entities(ref: EntityTarget | any): Entities {
	if (isEntityTarget(ref)) {
		return new Entities(ref)
	} else {
		return new Entities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

/** Generic multi-entity handle */
export class Entities extends BaseEntitiesHandle {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => entity({ entity_id: e.entity_id }))
	}
}
