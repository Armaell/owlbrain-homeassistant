import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export function entity(ref: string | EntityRef | any): Entity {
	if (typeof ref === "string") {
		return new Entity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new Entity(ref)
	} else {
		return new Entity(BaseEntityHandle.fromScriptInstance(ref))
	}
}

/** Generic single-entity handle */
export class Entity extends BaseEntityHandle {
	constructor(ref: Omit<EntityRef, "domain">) {
		const entity_id = typeof ref === "string" ? ref : ref.entity_id
		const domain = entity_id.split(".")[0]
		super({
			...ref,
			domain: domain
		})
	}
}
