import { container } from "owlbrain-core"
import type { HomeAssistantClient } from "../../../client/client"
import {
	IncorrectEntityDomainError,
	MissingEntityIdInScriptDataError
} from "../../../errors"
import { DEFAULT_NAMESPACE } from "../../../integration"
import type { EntitiesCache } from "../../entities-cache"

export interface EntityRef {
	namespace?: string
	entity_id: string
	domain: string
}

export abstract class BaseEntityHandle<STATE = void> {
	readonly namespace: string
	readonly domain: string
	readonly entity_id: string
	protected client: HomeAssistantClient
	protected cache: EntitiesCache

	constructor(ref: EntityRef) {
		this.namespace = ref.namespace ?? DEFAULT_NAMESPACE
		this.entity_id = ref.entity_id
		this.domain = ref.domain

		if (!this.entity_id.startsWith(ref.domain)) {
			throw new IncorrectEntityDomainError({
				namespace: [this.namespace],
				entity_id: this.entity_id,
				expectedDomain: ref.domain
			})
		}

		this.client = container.resolve<HomeAssistantClient>([
			this.namespace,
			"client"
		])

		this.cache = container.resolve([this.namespace, "entity", "cache"])
	}

	static fromScriptInstance(scriptInstance: unknown) {
		const scriptData = scriptInstance["scriptData"]
		const namespace = scriptData?.["namespace"] ?? DEFAULT_NAMESPACE
		const scriptEntityId = scriptData?.["entity_id"]

		if (typeof scriptEntityId === "string") {
			return {
				namespace,
				entity_id: scriptEntityId
			}
		}

		if (Array.isArray(scriptEntityId) && scriptEntityId.length === 1) {
			return {
				namespace,
				entity_id: scriptEntityId[0]
			}
		}

		throw new MissingEntityIdInScriptDataError({})
	}

	get status() {
		return this.cache.get(this.entity_id)
	}

	get state(): STATE | undefined {
		const state = this.status
		return state?.state
	}

	is(stateValue: STATE): boolean {
		const state = this.state
		return state === stateValue
	}

	async action<T extends Record<string, any>>(service: string, data?: T) {
		return this.client.action({
			domain: this.domain,
			service,
			data,
			target: {
				entity_id: this.entity_id
			}
		})
	}

	get attributes() {
		return this.status?.attributes
	}
}
