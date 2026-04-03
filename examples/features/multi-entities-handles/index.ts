import { Logger, OwlBrain } from "owlbrain-core"
import type { OwlEntityUpdatedEvent } from "owlbrain-homeassistant"
import {
	EntityScript,
	HomeAssistantIntegration,
	OnStateChange,
	binarySensorEntity,
	lightEntities,
	lightEntity
} from "owlbrain-homeassistant"

const logger = new Logger(["example"])

/**
 * Example showing **how to use handles to manipulate entities**, but also:
 * - How to start OwlBrain
 * - How to do add the HomeAssistantIntegration
 * - How to listen to an entity state change
 *
 * You can run this example with `npm run example multi-entities-handles`
 */
@EntityScript({ area_id: ["kitchen", "living_room"] })
class HallwayMotionLighting {
	private logger = logger.child(["example"])

	lights = lightEntities(this)

	@OnStateChange({ to: "on", label_id: "motion" })
	async onMotion(event: OwlEntityUpdatedEvent) {
		this.logger.info(
			`Motion detected on ${event.data.entity_id}. Turning lights on`
		)

		await this.lights.turnOn()
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
