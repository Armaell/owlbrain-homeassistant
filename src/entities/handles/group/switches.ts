import { type EntityTarget, isEntityTarget } from "../../types"
import { type SwitchState, switchEntity } from "../single/switch"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"

export function switchEntities(ref: EntityTarget | any): SwitchEntities {
	if (isEntityTarget(ref)) {
		return new SwitchEntities(ref)
	} else {
		return new SwitchEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

export class SwitchEntities extends BaseEntitiesHandle<SwitchState> {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => switchEntity({ entity_id: e.entity_id }))
	}

	turnOn() {
		return this.action("switch", "turn_on")
	}

	turnOff() {
		return this.action("switch", "turn_off")
	}

	toggle() {
		return this.action("switch", "toggle")
	}
}
