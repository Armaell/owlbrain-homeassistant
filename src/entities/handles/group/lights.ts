import { type EntityTarget, isEntityTarget } from "../../types"
import {
	type LightColorOptions,
	type LightState,
	type LightTurnOffOptions,
	type LightTurnOnOptions,
	lightEntity
} from "../single/light"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"

export function lightEntities(ref: EntityTarget | any): LightEntities {
	if (isEntityTarget(ref)) {
		return new LightEntities(ref)
	} else {
		return new LightEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

export class LightEntities extends BaseEntitiesHandle<LightState> {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => lightEntity({ entity_id: e.entity_id }))
	}

	turnOn(options?: LightTurnOnOptions) {
		return this.action("light", "turn_on", options)
	}

	turnOff(options?: LightTurnOffOptions) {
		return this.action("light", "turn_off", options)
	}

	toggle() {
		return this.action("light", "toggle")
	}

	setBrightnessRaw(raw: number) {
		return this.turnOn({ brightness: raw })
	}

	setBrightnessPercent(percent: number) {
		const raw = Math.round((percent / 100) * 255)
		return this.turnOn({ brightness: raw })
	}

	setColor(options: LightColorOptions) {
		return this.turnOn(options)
	}

	setColorTemp(kelvin: number) {
		return this.turnOn({ color_temp: kelvin })
	}

	setEffect(effect: string) {
		return this.turnOn({ effect })
	}
}
