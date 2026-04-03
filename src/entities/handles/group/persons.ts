import { type EntityTarget, isEntityTarget } from "../../types"
import { type PersonState, personEntity } from "../single/person"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"

export function personEntities(ref: EntityTarget | any): PersonEntities {
	if (isEntityTarget(ref)) {
		return new PersonEntities(ref)
	} else {
		return new PersonEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

export class PersonEntities extends BaseEntitiesHandle<PersonState> {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => personEntity({ entity_id: e.entity_id }))
	}
}
