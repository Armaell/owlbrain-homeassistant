import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export type SunState = "below_horizon" | "above_horizon"

export function sunEntity(
	ref: string | EntityRef | any = "sun.sun"
): SunEntity {
	if (typeof ref === "string") {
		return new SunEntity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new SunEntity(ref)
	} else {
		return new SunEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}

export class SunEntity extends BaseEntityHandle<SunState> {
	constructor(ref: Omit<EntityRef, "domain"> = { entity_id: "sun.sun" }) {
		super({
			...ref,
			domain: "sun"
		})
	}

	get elevation(): number | undefined {
		return this.attributes?.elevation
	}

	get azimuth(): number | undefined {
		return this.attributes?.azimuth
	}

	get nextRising(): string | undefined {
		return this.attributes?.next_rising
	}

	get nextSetting(): string | undefined {
		return this.attributes?.next_setting
	}

	get nextDawn() {
		return this.attributes?.["next_dawn"]
	}
	get nextDusk() {
		return this.attributes?.["next_dusk"]
	}
	get nextMidnight() {
		return this.attributes?.["next_midnight"]
	}
	get nextNoon() {
		return this.attributes?.["next_noon"]
	}

	private parseTime(value?: string): Date | undefined {
		if (!value) return undefined
		return new Date(value)
	}

	private isBefore(time?: string): boolean | undefined {
		const target = this.parseTime(time)
		if (!target) return undefined
		return new Date() < target
	}

	private isAfter(time?: string): boolean | undefined {
		const target = this.parseTime(time)
		if (!target) return undefined
		return new Date() > target
	}

	get isBeforeDawn(): boolean | undefined {
		return this.isBefore(this.nextDawn)
	}

	get isAfterDawn(): boolean | undefined {
		return this.isAfter(this.nextDawn)
	}

	get isBeforeDusk(): boolean | undefined {
		return this.isBefore(this.nextDusk)
	}

	get isAfterDusk(): boolean | undefined {
		return this.isAfter(this.nextDusk)
	}

	get isBeforeSunrise(): boolean | undefined {
		return this.isBefore(this.nextRising)
	}

	get isAfterSunrise(): boolean | undefined {
		return this.isAfter(this.nextRising)
	}

	get isBeforeSunset(): boolean | undefined {
		return this.isBefore(this.nextSetting)
	}

	get isAfterSunset(): boolean | undefined {
		return this.isAfter(this.nextSetting)
	}
}
