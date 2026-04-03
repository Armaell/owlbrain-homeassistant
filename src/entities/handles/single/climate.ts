import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export interface ClimateSetTemperatureOptions {
	temperature?: number
	target_temp_high?: number
	target_temp_low?: number
	hvac_mode?: string
}

export type ClimateState = string

export function climateEntity(ref: string | EntityRef | any): ClimateEntity {
	if (typeof ref === "string") {
		return new ClimateEntity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ClimateEntity(ref)
	} else {
		return new ClimateEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}
export class ClimateEntity extends BaseEntityHandle<ClimateState> {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "climate"
		})
	}

	async setTemperature(options: ClimateSetTemperatureOptions) {
		return this.action("set_temperature", options)
	}

	async setHvacMode(mode: string) {
		return this.action("set_hvac_mode", { hvac_mode: mode })
	}

	get currentTemperature(): number | undefined {
		return this.attributes?.current_temperature
	}

	get targetTemperature(): number | undefined {
		return this.attributes?.temperature
	}

	get hvacMode(): string | undefined {
		return this.attributes?.hvac_mode
	}
}
