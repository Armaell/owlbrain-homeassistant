import { type EntityTarget, isEntityTarget } from "../../types"
import { type VacuumState, vacuumEntity } from "../single/vacuum"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"

export function vacuumEntities(ref: EntityTarget | any): VacuumEntities {
	if (isEntityTarget(ref)) {
		return new VacuumEntities(ref)
	} else {
		return new VacuumEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

export class VacuumEntities extends BaseEntitiesHandle<VacuumState> {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => vacuumEntity({ entity_id: e.entity_id }))
	}

	start() {
		return this.action("vacuum", "start")
	}

	stop() {
		return this.action("vacuum", "stop")
	}

	returnToBase() {
		return this.action("vacuum", "return_to_base")
	}

	pause() {
		return this.action("vacuum", "pause")
	}
}
