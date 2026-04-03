import {
	Inject,
	Logger,
	OwlBrain,
	type OwlEvent,
	Schedule,
	Script
} from "owlbrain-core"
import type {
	HomeAssistantClient,
	OwlEntityUpdatedEvent
} from "owlbrain-homeassistant"
import {
	HomeAssistantIntegration,
	OnStateChange,
	managedSensorEntity
} from "owlbrain-homeassistant"

const logger = new Logger(["example"])

/**
 * Basic example showing **how to create an entity** and **set its state**, but also:
 * - How to start OwlBrain
 * - How to do add the HomeAssistantIntegration
 * - How to listen to an entity state change
 * - How to do a home assistant action
 *
 * You can run this example with `npm run example basic`
 */
@Script()
class BasicExample {
	private logger = logger.child(["script"])

	mySensor = managedSensorEntity("sensor.my_sensor")
	i = 0

	@Schedule.text("every 2 seconds")
	async onHallwayMotion(event: OwlEvent) {
		await this.mySensor.setState((++this.i).toString())
		this.logger.info("sensor now", this.i)
	}
}

async function main() {
	const owlbrain = await OwlBrain.withIntegration(
		HomeAssistantIntegration({
			baseUrl: process.env.HA_URL!,
			token: process.env.HA_TOKEN!,
			managed: [
				{
					entity_id: "sensor.my_sensor"
				}
			]
		})
	).start()

	logger.info("Waiting for OwlBrain to stop")

	await owlbrain.wait()

	logger.info("🦉🧠")
}

main()
