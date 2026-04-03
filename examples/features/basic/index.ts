import { Inject, Logger, OwlBrain } from "owlbrain-core"
import type {
	HomeAssistantClient,
	OwlEntityUpdatedEvent
} from "owlbrain-homeassistant"
import {
	Entity,
	EntityScript,
	HomeAssistantIntegration,
	OnStateChange
} from "owlbrain-homeassistant"

const logger = new Logger(["example"])

/**
 * Basic example showing:
 * - How to start OwlBrain
 * - How to do add the HomeAssistantIntegration
 * - How to listen to an entity state change
 * - How to do a home assistant action
 *
 * You can run this example with `npm run example basic`
 */
@EntityScript({ entity_id: "binary_sensor.motion_hall" })
class BasicExample {
	private logger = logger.child(["script"])

	@Inject(["homeassistant", "client"])
	homeAssistant!: HomeAssistantClient

	@OnStateChange({ to: "on" })
	async onHallwayMotion(event: OwlEntityUpdatedEvent) {
		this.logger.info(
			"Movement detected in the hallway",
			"so we turn on the light"
		)

		await this.homeAssistant.action({
			domain: "light",
			service: "turn_on",
			target: { entity_id: "light.hallway" }
		})
	}
}

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

main()
