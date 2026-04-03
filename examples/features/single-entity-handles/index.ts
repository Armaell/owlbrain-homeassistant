import { Logger, OwlBrain } from "owlbrain-core"
import type { OwlEntityUpdatedEvent } from "owlbrain-homeassistant"
import {
	EntityScript,
	HomeAssistantIntegration,
	OnStateChange,
	binarySensorEntity,
	lightEntity
} from "owlbrain-homeassistant"

const logger = new Logger(["example"])

/**
 * Example showing **how to use handles to manipulate entities**, but also:
 * - How to start OwlBrain
 * - How to do add the HomeAssistantIntegration
 * - How to listen to an entity state change
 *
 * You can run this example with `npm run example single-entity-handles`
 */
@EntityScript({ entity_id: "binary_sensor.hallway_motion" })
class HallwayMotionLighting {
	private logger = logger.child(["example"])

	motion = binarySensorEntity(this)
	light = lightEntity("light.hallway")

	@OnStateChange({ to: "on" })
	async onMotion(event: OwlEntityUpdatedEvent) {
		const brightness = this.light.brightness!

		this.logger.info(
			`Motion detected on ${this.motion.entity_id}. Current brightness: ${brightness}`
		)

		if (this.light.isOff) {
			this.logger.info("Light is off → turning it on at 40%")
			await this.light.setBrightness(40)
			return
		}

		if (brightness < 150) {
			this.logger.info("Light is dim → increasing brightness to 100%")
			await this.light.setBrightness(100)
			return
		}
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
