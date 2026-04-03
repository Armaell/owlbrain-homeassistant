import { Logger, OwlBrain } from "owlbrain-core"
import type { OwlEntityUpdatedEvent } from "owlbrain-homeassistant"
import {
	EntityScript,
	HomeAssistantIntegration,
	OnStateChange,
	lightEntity
} from "owlbrain-homeassistant"

const logger = new Logger(["example"])

/**
 * Example showing **that we can extend a class with event decorators**
 * and **that we can have multiple instances of a single script**, but also:
 * - How to start OwlBrain
 * - How to do add the HomeAssistantIntegration
 * - How to listen to an entity state change
 * - How to use handles to manipulate entities
 *
 * You can run this example with `npm run example shared-script`
 */
class BaseScriptExample {
	private logger = logger.child(["script"])

	light = lightEntity(this)

	@OnStateChange({ to: "off" })
	async onOff(event: OwlEntityUpdatedEvent) {
		this.logger.info(
			`The ${event.data.entity_id} has been turned off`,
			"We turn it back on right away"
		)

		await this.light.turnOn()
	}
}

@EntityScript({ entity_id: "light.kitchen" })
@EntityScript({ entity_id: "light.hallway" })
@EntityScript({ entity_id: "light.bedroom" })
class SharedScriptExample extends BaseScriptExample {}

async function main() {
	const owlbrain = await OwlBrain.withIntegration(
		HomeAssistantIntegration({
			baseUrl: process.env.HA_URL!,
			token: process.env.HA_TOKEN!
		})
	).start()

	logger.info("Waiting for OwlBrain to stop")

	await owlbrain.wait()

	logger.info("🦉🧠")
}
