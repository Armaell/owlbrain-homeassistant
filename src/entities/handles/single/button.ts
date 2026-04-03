import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export function buttonEntity(ref: string | EntityRef | any): ButtonEntity {
	if (typeof ref === "string") {
		return new ButtonEntity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ButtonEntity(ref)
	} else {
		return new ButtonEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}

export class ButtonEntity extends BaseEntityHandle {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "button"
		})
	}

	async press() {
		return this.action("press")
	}
}
