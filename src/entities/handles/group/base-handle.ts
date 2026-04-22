import { container } from "owlbrain-core"
import type { HomeAssistantClient } from "../../../client/client"
import type { EntitiesCache } from "../../entities-cache"
import { type EntityTarget, EntityTargetSchema } from "../../types"
import { DEFAULT_NAMESPACE } from "../../../integration"
import { InvalidTargetError } from "../../../errors"

export interface EntitiesRef extends EntityTarget {
	namespace?: string
}

export abstract class BaseEntitiesHandle<STATE = void> {
	readonly namespace: string
	protected client: HomeAssistantClient
	protected cache: EntitiesCache

	readonly target: EntityTarget

	constructor(ref: EntitiesRef) {
		this.namespace = ref.namespace ?? DEFAULT_NAMESPACE
		this.target = {
			area_id: ref.area_id,
			device_id: ref.device_id,
			entity_id: ref.entity_id,
			label_id: ref.label_id
		}

		this.client = container.resolve<HomeAssistantClient>([
			this.namespace,
			"client"
		])

		this.cache = container.resolve<EntitiesCache>([
			this.namespace,
			"entity",
			"cache"
		])
	}

	static fromScriptInstance(scriptInstance: any): EntitiesRef {
		const scriptData = scriptInstance["scriptData"]

		const area_id = scriptData?.["area_id"]
		const device_id = scriptData?.["device_id"]
		const entity_id = scriptData?.["entity_id"]
		const label_id = scriptData?.["label_id"]

		const parsedEntityTarget = EntityTargetSchema.safeParse(scriptData)
		if (!parsedEntityTarget.success) {
			throw new InvalidTargetError({})
		}

		return {
			namespace: scriptData["namespace"] ?? DEFAULT_NAMESPACE,
			area_id,
			device_id,
			entity_id,
			label_id
		}
	}

	get entity_ids(): string[] {
		return this.cache
			.resolveTarget(this.target)
			.map((entity) => entity.entity_id)
	}

	get statuses() {
		return new Map(
			this.cache
				.resolveTarget(this.target)
				.map((entity) => [entity.entity_id, entity])
		)
	}

	get states(): Map<string, any> {
		return new Map(
			this.cache
				.resolveTarget(this.target)
				.map((entity) => [entity.entity_id, entity.state])
		)
	}

	/**
	 * Will check if any entity matches the given state
	 * @example entity.areAll("on") // true if one entity is "on"
	 */
	areAll(stateValue: STATE): boolean {
		for (const state of this.states.values()) {
			if (state !== stateValue) return false
		}
		return true
	}

	/**
	 * Will check if any entity matches the given state
	 * @example entity.isAny("on") // true if one entity is "on"
	 */
	isAny(stateValue: STATE): boolean {
		for (const state of this.states.values()) {
			if (state === stateValue) return true
		}
		return false
	}

	async action<T extends Record<string, any>>(
		domain: string,
		service: string,
		data?: T
	) {
		return this.client.action({ domain, service, data, target: this.target })
	}

	get attributes() {
		return new Map(
			this.cache
				.resolveTarget(this.target)
				.map((entity) => [entity.entity_id, entity.attributes])
		)
	}

	getAttributesNamed(attributeName: string) {
		return new Map(
			this.cache
				.resolveTarget(this.target)
				.map((entity) => [entity.entity_id, entity.attributes?.[attributeName]])
		)
	}
}
