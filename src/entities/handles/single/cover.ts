import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export function coverEntity(ref: string | EntityRef | any): CoverEntity {
	if (typeof ref === "string") {
		return new CoverEntity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new CoverEntity(ref)
	} else {
		return new CoverEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}

export type CoverState = "open" | "closed" | string | "unknown" | "unavailable"

export class CoverEntity extends BaseEntityHandle<CoverState> {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "cover"
		})
	}

	async open() {
		return this.action("open_cover")
	}

	async close() {
		return this.action("close_cover")
	}

	async stop() {
		return this.action("stop_cover")
	}

	async setPosition(percent: number) {
		return this.action("set_cover_position", { position: percent })
	}

	get position(): number | undefined {
		return this.attributes?.current_position
	}
}
