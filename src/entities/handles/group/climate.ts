import { type EntityTarget, isEntityTarget } from "../../types"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"
import {
	type ClimateSetTemperatureOptions,
	type ClimateState,
	climateEntity
} from "../single/climate"

export function climateEntities(ref: EntityTarget | any): ClimateEntities {
	if (isEntityTarget(ref)) {
		return new ClimateEntities(ref)
	} else {
		return new ClimateEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

export class ClimateEntities extends BaseEntitiesHandle<ClimateState> {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => climateEntity({ entity_id: e.entity_id }))
	}

	setTemperature(options: ClimateSetTemperatureOptions) {
		return this.action("climate", "set_temperature", options)
	}

	setHvacMode(mode: string) {
		return this.action("climate", "set_hvac_mode", { hvac_mode: mode })
	}

	currentTemperatures() {
		return this.getAttributesNamed("current_temperature")
	}

	targetTemperatures() {
		return this.getAttributesNamed("temperature")
	}

	hvacModes() {
		return this.getAttributesNamed("hvac_mode")
	}
}
