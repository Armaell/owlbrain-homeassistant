// person-handle.ts
import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export type PersonState = string

export function personEntity(ref: string | EntityRef | any): PersonEntity {
	if (typeof ref === "string") {
		return new PersonEntity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new PersonEntity(ref)
	} else {
		return new PersonEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}

export class PersonEntity extends BaseEntityHandle<PersonState> {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "person"
		})
	}

	get latitude(): number | undefined {
		return this.attributes?.latitude
	}

	get longitude(): number | undefined {
		return this.attributes?.longitude
	}

	/**
	 * GPS accuracy in meters
	 */
	get gpsAccuracy(): number | undefined {
		return this.attributes?.gps_accuracy
	}

	get source(): string | undefined {
		return this.attributes?.source
	}
}
