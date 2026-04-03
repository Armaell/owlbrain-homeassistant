import { type EntityTarget, isEntityTarget } from "../../types"
import { type SensorState, sensorEntity } from "../single"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"

export function sensorEntities(ref: EntityTarget | any): SensorEntities {
	if (isEntityTarget(ref)) {
		return new SensorEntities(ref)
	} else {
		return new SensorEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

export class SensorEntities extends BaseEntitiesHandle<SensorState> {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => sensorEntity({ entity_id: e.entity_id }))
	}

	deviceClasses() {
		return this.getAttributesNamed("device_class")
	}
}
