import { Inject, Logger, OnlyIf, OwlBrain } from "owlbrain-core"
import {
	EntityScript,
	HomeAssistantIntegration,
	OnZoneChange,
	climateEntities,
	lightEntities,
	mediaPlayerEntities,
	personEntities
} from "owlbrain-homeassistant"
import type {
	HomeAssistantClient,
	OwlZoneChangedEvent
} from "owlbrain-homeassistant"

const logger = new Logger(["example"])

/**
 * Practical example
 *
 * Convenience script:
 * > When the last person leaves home:
 * > - Turn off all lights
 * > - Pause media players
 * > - Set climate to eco mode
 * >
 * > When someone arrives:
 * > - Restore lights that were previously on
 * > - Resume normal climate mode
 *

 * You can run this example with `npm run example home-away`
 */
@EntityScript({ entity_id: ["person.alice", "person.bob"] })
class PresenceAwareEnergySaver {
	private logger = logger.child(["presence"])

	@Inject(["homeassistant", "client"])
	homeAssistant!: HomeAssistantClient

	// Handles for devices we want to control
	persons = personEntities(this)
	lights = lightEntities({ area_id: ["living_room", "kitchen", "hallway"] })
	hallwayLights = lightEntities({ area_id: "hallway" })
	climate = climateEntities(["living_room"])
	media = mediaPlayerEntities(["living_room_tv"])

	// We store which lights were on before leaving
	private previousLightState: Map<string, string> | undefined

	@OnZoneChange({ from: "home" })
	@OnlyIf((_, s) => s.persons.isAny.home)
	async onSomeoneLeft(event: OwlZoneChangedEvent) {
		this.logger.info(`${event.data.entity_id} left home`)

		this.logger.info("Everyone left → activating away mode")

		// Save which lights were on
		this.previousLightState = this.lights.states

		// Turn off everything
		await this.lights.turnOff()
		await this.media.stop()
		await this.climate.setHvacMode("eco")

		this.logger.info("House set to away mode")
	}

	@OnZoneChange({ to: "home" })
	async onSomeoneArrived(event: OwlZoneChangedEvent) {
		this.logger.info(`${event.data.entity_id} arrived home`)

		// Restore lights that were previously on
		if (this.previousLightState) {
			this.logger.info("Restoring previous lighting state")
			for (const entity_id of Array.from(this.previousLightState.keys())) {
				const state = this.previousLightState.get(entity_id)
				if (state === "on")
					await this.homeAssistant.action({
						domain: "light",
						service: "turn_on",
						target: { entity_id }
					})
			}
			this.previousLightState = undefined
		} else {
			// If no previous state, turn on hallway lights for convenience
			this.logger.info("No previous state → turning on hallway lights")
			await this.hallwayLights.turnOn()
		}

		// Restore climate
		await this.climate.setHvacMode("comfort")

		this.logger.info("Welcome home mode activated")
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
