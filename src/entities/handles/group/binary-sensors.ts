import { type EntityTarget, isEntityTarget } from "../../types"
import { type BinarySensorState, binarySensorEntity } from "../single"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"

export function binarySensorEntities(
	ref: EntityTarget | any
): BinarySensorEntities {
	if (isEntityTarget(ref)) {
		return new BinarySensorEntities(ref)
	} else {
		return new BinarySensorEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

export class BinarySensorEntities extends BaseEntitiesHandle<BinarySensorState> {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => binarySensorEntity({ entity_id: e.entity_id }))
	}

	deviceClasses() {
		return this.getAttributesNamed("device_class")
	}
}
