import type { HomeAssistantWebsocket } from "./websocket"
import type { ActionCall } from "./types"

export class HomeAssistantClient {
	constructor(private ws: HomeAssistantWebsocket) {}

	async action(args: ActionCall) {
		return this.ws.performAction(args)
	}
}
