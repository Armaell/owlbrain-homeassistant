import type { Connection, HassEntity } from "home-assistant-js-websocket"
import {
	createConnection,
	createLongLivedTokenAuth
} from "home-assistant-js-websocket"

import type { EventBus, Logger } from "owlbrain-core"
import type {
	ActionCall,
	AreaRegistryEntry,
	EntityRegistryEntry,
	ServiceCallResponse
} from "./types"
import type { EntitiesCache } from "../entities/entities-cache"
import type { HomeAssistantIntegrationResolvedConfig } from "../integration"
import { ConnectionError, NotConnectedError } from "../errors"
import { WebsocketEventsHandler } from "./websocket-events-handler"
import type { ManagedRegistry } from "../entities/managed-registry"
import { WebsocketToCompanion } from "./websocket-to-companion"

export class HomeAssistantWebsocket {
	private _conn: Connection | null = null
	private readonly logger: Logger
	private eventsHandlers: WebsocketEventsHandler
	private _companion?: WebsocketToCompanion

	constructor(
		private config: HomeAssistantIntegrationResolvedConfig,
		private entitiesCache: EntitiesCache,
		private managedRegistry: ManagedRegistry,
		eventBus: EventBus,
		logger: Logger
	) {
		this.entitiesCache = entitiesCache
		this.logger = logger.child(["websocket"])
		this.eventsHandlers = new WebsocketEventsHandler(
			this.config,
			entitiesCache,
			eventBus
		)
	}

	private get conn() {
		if (!this._conn)
			throw new NotConnectedError({ namespace: [this.config.name] })
		return this._conn
	}

	get companion() {
		if (!this._companion)
			this._companion = new WebsocketToCompanion(this.config, this.conn)
		return this._companion
	}

	async connect() {
		try {
			const auth = createLongLivedTokenAuth(
				this.config.baseUrl,
				this.config.token
			)

			this._conn = await createConnection({ auth })
			this.conn.addEventListener("ready", () => {
				this.logger.info("Reconnected to Home Assistant")
			})
			this.conn.addEventListener("disconnected", () => {
				this.logger.warn("Connection to Home Assistant lost")
			})
			this.logger.info("Connected to Home Assistant")

			const states = await this.conn.sendMessagePromise<HassEntity[]>({
				type: "get_states"
			})
			const entities = await this.conn.sendMessagePromise<
				EntityRegistryEntry[]
			>({
				type: "config/entity_registry/list"
			})
			const areas = await this.conn.sendMessagePromise<AreaRegistryEntry[]>({
				type: "config/area_registry/list"
			})
			this.entitiesCache.populate(states, entities, areas)
			await this.managedRegistry.sync()

			await this.setupSubscriptions()
		} catch (err) {
			throw new ConnectionError({
				namespace: this.logger.namespace,
				cause: err
			})
		}
	}

	private async setupSubscriptions() {
		for (const [eventType, handler] of Object.entries(
			this.eventsHandlers.handlers
		)) {
			await this.conn.subscribeEvents((ev) => {
				handler(ev).catch((err) => {
					this.logger.error(`Error in handler for ${eventType}`, err)
				})
			}, eventType)
		}
	}

	close() {
		if (!this._conn) return
		this.conn.close()
		this._conn = null
		this.logger.info("Disconnected from Home Assistant")
	}

	async performAction(args: ActionCall) {
		return this.conn.sendMessagePromise<ServiceCallResponse>({
			type: "call_service",
			domain: args.domain,
			service: args.service,
			service_data: args.data,
			target: args.target,
			return_response: args.return_response
		})
	}
}
