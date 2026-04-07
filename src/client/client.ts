import type { HomeAssistantWebsocket } from "./websocket"
import type { ActionCall } from "./types"

export class HomeAssistantClient {
	/**
	 * Websocket requires caller to set whether a response is excepted or not.
	 * Auto-detect the requirement in behalf of the user
	 */
	private servicesRequiringReturnTrue = new Set<string>()

	constructor(private ws: HomeAssistantWebsocket) {}

	async action(args: ActionCall) {
		try {
			return await this.ws.performAction({
				return_response: this.servicesRequiringReturnTrue.has(args.service),
				...args
			})
		} catch (e) {
			if (
				e.code === "service_validation_error" &&
				e.translation_key === "service_lacks_response_request"
			) {
				this.servicesRequiringReturnTrue.add(args.service)
				return this.ws.performAction({ ...args, return_response: true })
			}
			throw e
		}
	}
}
