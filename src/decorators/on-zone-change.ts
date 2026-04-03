import { buildEventDecorator } from "owlbrain-core/integration"
import type { OwlZoneChangedEvent } from "../types"
import { DEFAULT_NAMESPACE } from "../integration"
import { EntityDecoratorConfigSchema } from "./entity"
import { container } from "owlbrain-core"
import type { EntitiesCache } from "../entities/entities-cache"
import type { EntityTarget } from "../entities/types"

export interface OnZoneConfig extends EntityTarget {
	from?: string
	to?: string
}

/**
 * Decorator that runs a method whenever a matching entity enters or leaves a zone.
 *
 * @remarks
 * Home Assistant uses `"not_home"` when a device or person is outside all registered zones.
 *
 * @example
 * ```ts
 * // Trigger when a person arrives home
 * @OnZoneChange({ entity_id: "person.rayan", to: "home" })
 * async handleArrival(event) {
 *   console.log("Welcome home!")
 * }
 * ```
 *
 * @example
 * ```ts
 * // Trigger when someone leaves work
 * @OnZoneChange({ entity_id: ["person.dani", "person.devi"], from: "work", to: "not_home" })
 * async handleLeavingWork(event) {
 *   // ...
 * }
 * ```
 */
export const OnZoneChange = buildEventDecorator(
	async (
		method: (event: OwlZoneChangedEvent) => Promise<void>,
		scriptData: unknown,
		eventConfig: OnZoneConfig
	) => {
		const scriptConfig =
			EntityDecoratorConfigSchema.safeParse(scriptData).data ?? {}

		const eventNamespace = scriptConfig?.namespace ?? DEFAULT_NAMESPACE
		const entitiesCache = container.resolve<EntitiesCache>([
			eventNamespace,
			"entity",
			"cache"
		])

		return {
			method,
			eventFilter: (event: OwlZoneChangedEvent) => {
				if (
					!entitiesCache.matchesTarget(event.data.entity_id, {
						...scriptConfig,
						...eventConfig
					})
				)
					return false
				if (
					eventConfig.from &&
					event.data.old_state?.state !== eventConfig.from
				)
					return false
				if (eventConfig.to && event.data.new_state?.state !== eventConfig.to)
					return false
				return true
			},
			eventNamespace,
			eventName: "zone_change",
			scriptData
		}
	}
)
