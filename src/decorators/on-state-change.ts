import { buildEventDecorator } from "owlbrain-core/integration"
import type { OwlEntityUpdatedEvent } from "../types"
import { DEFAULT_NAMESPACE } from "../integration"
import { EntityDecoratorConfigSchema } from "./entity"
import { container } from "owlbrain-core"
import type { EntitiesCache } from "../entities/entities-cache"
import type { EntityTarget } from "../entities/types"

export interface OnStateConfig extends EntityTarget {
	from?: string
	to?: string
}

/**
 * Decorator that runs a method whenever a matching entity changes state.
 *
 * If both `from` and `to` are provided, the method is only called when the
 * entity transitions exactly between those two states.\
 * If only one is provided, it is matched independently.\
 * If none, it matches any state change.
 *
 * @example
 * ```ts
 * // Trigger when the kitchen light is turned on
 * @OnStateChange({ entity_id: "light.kitchen", to: "on" })
 * async handleLightOn(event) {
 *   logger.info("Light turned on:", event.data.entity_id)
 * }
 * ```
 *
 * @example
 * ```ts
 * // Trigger only when a door goes from "closed" to "open"
 * @OnStateChange({ entity_id: ["binary_sensor.front_door", "binary_sensor.garden_door"], from: "off", to: "on" })
 * async handleDoorOpened(event) {
 *   // ...
 * }
 * ```
 */

export const OnStateChange = buildEventDecorator(
	async (
		method: (event: OwlEntityUpdatedEvent) => Promise<void>,
		scriptData: unknown,
		eventConfig: OnStateConfig
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
			eventFilter: (event: OwlEntityUpdatedEvent) => {
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
			eventName: "entity_updated",
			scriptData
		}
	}
)
