import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export interface LightColorOptions {
	rgb?: [number, number, number]
	rgbw?: [number, number, number, number]
	rgbww?: [number, number, number, number, number]
	color_temp?: number
	hs_color?: [number, number]
}

export interface LightEffectOptions {
	effect?: string
}

export interface LightTurnOnOptions
	extends LightColorOptions, LightEffectOptions {
	brightness?: number
	transition?: number
}

export interface LightTurnOffOptions {
	brightness?: number
	transition?: number
}

export type LightState = "on" | "off" | "unknown" | "unavailable"

export function lightEntity(ref: string | EntityRef | any): LightEntity {
	if (typeof ref === "string") {
		return new LightEntity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new LightEntity(ref)
	} else {
		return new LightEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}

export class LightEntity extends BaseEntityHandle<LightState> {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "light"
		})
	}

	get isOn(): boolean {
		return this.state === "on"
	}

	get isOff(): boolean {
		return this.state === "off"
	}

	get brightness(): number | undefined {
		return this.attributes?.brightness
	}

	turnOn(options?: LightTurnOnOptions) {
		return this.action("turn_on", options)
	}

	turnOff(options?: LightTurnOffOptions) {
		return this.action("turn_off", options)
	}

	toggle() {
		return this.action("toggle")
	}

	setBrightnessRaw(raw: number) {
		return this.turnOn({ brightness: raw })
	}

	setBrightnessPercent(percent: number) {
		const raw = Math.round((percent / 100) * 255)
		return this.turnOn({ brightness: raw })
	}

	setBrightness(value: number | { percent: number } | { raw: number }) {
		if (typeof value === "number") {
			return this.setBrightnessPercent(value)
		}

		if ("percent" in value) {
			return this.setBrightnessPercent(value.percent)
		}

		if ("raw" in value) {
			return this.setBrightnessRaw(value.raw)
		}
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
