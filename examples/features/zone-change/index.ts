import { Logger, OwlBrain, container } from "owlbrain-core"
import type { OwlEntityUpdatedEvent } from "owlbrain-homeassistant"
import {
	EntityScript,
	HomeAssistantIntegration,
	OnZoneChange
} from "owlbrain-homeassistant"
import type { OwlZoneChangedEvent } from "../../../src/types"

const logger = new Logger(["example"])

/**
 * Example showing **how to listen to entity zone change**, but also:
 * - How to start OwlBrain
 * - How to do add the HomeAssistantIntegration
 * - How to do a home assistant action
 *
 * You can run this example with `npm run example zone-change`
 */
@EntityScript({ entity_id: "person.tian" })
class BasicExample {
	private logger = logger.child(["script"])

	@OnZoneChange({ from: "home", to: "not_home" })
	async onLeftHome(event: OwlZoneChangedEvent) {
		this.logger.info("Tian left the house")
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
