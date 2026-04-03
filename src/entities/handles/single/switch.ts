import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export type SwitchState = "on" | "off" | "unknown" | "unavailable"

export function switchEntity(ref: string | EntityRef | any): SwitchEntity {
	if (typeof ref === "string") {
		return new SwitchEntity({ entity_id: ref })
	} else if (typeof ref === "object") {
		return new SwitchEntity(ref)
	} else {
		return new SwitchEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}

export class SwitchEntity extends BaseEntityHandle<SwitchState> {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "switch"
		})
	}

	async turnOn() {
		return this.action("turn_on")
	}

	async turnOff() {
		return this.action("turn_off")
	}

	async toggle() {
		return this.action("toggle")
	}
}
