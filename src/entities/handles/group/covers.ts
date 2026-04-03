import { type EntityTarget, isEntityTarget } from "../../types"
import { type CoverState, coverEntity } from "../single/cover"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"

export function coverEntities(ref: EntityTarget | any): CoverEntities {
	if (isEntityTarget(ref)) {
		return new CoverEntities(ref)
	} else {
		return new CoverEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

export class CoverEntities extends BaseEntitiesHandle<CoverState> {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => coverEntity({ entity_id: e.entity_id }))
	}

	open() {
		return this.action("cover", "open_cover")
	}

	close() {
		return this.action("cover", "close_cover")
	}

	stop() {
		return this.action("cover", "stop_cover")
	}

	setPosition(percent: number) {
		return this.action("cover", "set_cover_position", { position: percent })
	}

	positions() {
		return this.getAttributesNamed("current_position")
	}
}
