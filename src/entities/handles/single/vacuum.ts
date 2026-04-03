import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export type VacuumState = string

export function vacuumEntity(ref: string | EntityRef | any): VacuumEntity {
	if (typeof ref === "string") {
		return new VacuumEntity({ entity_id: ref })
	} else if (typeof ref === "object") {
		return new VacuumEntity(ref)
	} else {
		return new VacuumEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}

export class VacuumEntity extends BaseEntityHandle<VacuumState> {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "vacuum"
		})
	}

	async start() {
		return this.action("start")
	}

	async stop() {
		return this.action("stop")
	}

	async returnToBase() {
		return this.action("return_to_base")
	}

	async pause() {
		return this.action("pause")
	}
}
