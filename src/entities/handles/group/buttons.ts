import { type EntityTarget, isEntityTarget } from "../../types"
import { buttonEntity } from "../single/button"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"

export function buttonEntities(ref: EntityTarget | any): ButtonEntities {
	if (isEntityTarget(ref)) {
		return new ButtonEntities(ref)
	} else {
		return new ButtonEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

export class ButtonEntities extends BaseEntitiesHandle {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => buttonEntity({ entity_id: e.entity_id }))
	}

	press() {
		return this.action("button", "press")
	}
}
