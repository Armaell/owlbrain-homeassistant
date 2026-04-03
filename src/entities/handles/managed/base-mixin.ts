import { Logger, container } from "owlbrain-core"
import type { HomeAssistantWebsocket } from "../../../client/websocket"
import type { ManagedRegistry } from "../../managed-registry"

type Constructor<T = {}> = new (...args: any[]) => T

interface PublicBaseEntityHandle {
	namespace: string
	domain: string
	entity_id: string
}

export function ManagedEntity<
	TBase extends Constructor<PublicBaseEntityHandle>,
	STATE = void
>(Base: TBase) {
	return class ManagedEntity extends Base {
		constructor(...args: any[]) {
			super(...args)

			const managedRegistry = container.resolve<ManagedRegistry>([
				this.namespace,
				"entity",
				"managed"
			])
			if (!managedRegistry.hasEntityId(this.entity_id)) {
				const logger = new Logger([this.namespace])
				logger.error(
					"Could not find the managed entity",
					this.entity_id,
					"in home assistant"
				)
			}
		}

		public async setState(state: STATE) {
			const ws = container.resolve<HomeAssistantWebsocket>([
				this.namespace,
				"client",
				"websocket"
			])
			await ws.companion?.updateEntityState({
				entity_id: this.entity_id,
				state: state
			})
		}
	}
}
