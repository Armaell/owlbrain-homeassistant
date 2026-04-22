import type { EventBus } from "owlbrain-core"
import { Logger, container } from "owlbrain-core"
import { HomeAssistantWebsocket } from "./client/websocket"
import { HomeAssistantClient } from "./client/client"
import type { ClientConfig } from "./client/types"
import { EntitiesCache } from "./entities/entities-cache"
import { type OwlIntegrationFactory } from "owlbrain-core/integration"
import WebSocket from "ws"
import {
	ManagedRegistry,
	type OwlManagedConfig
} from "./entities/managed-registry"
;(globalThis as any).WebSocket = WebSocket

export interface HomeAssistantIntegrationConfig extends ClientConfig {
	/**
	 * Unique integration name. Change it to a unique value if you wish to use multiple HttpIntegration
	 * @default "homeassistant"
	 */
	name?: string
	/**
	 * List of managed entities and devices to create
	 */
	managed?: OwlManagedConfig[]
}
type HomeAssistantIntegrationDefaultConfig = Required<
	Pick<HomeAssistantIntegrationConfig, "name">
>
export type HomeAssistantIntegrationResolvedConfig =
	HomeAssistantIntegrationConfig & HomeAssistantIntegrationDefaultConfig

export const DEFAULT_NAMESPACE = "homeassistant" as const

const defaultConfig: HomeAssistantIntegrationDefaultConfig = {
	name: DEFAULT_NAMESPACE
}

/**
 * This integration allow to connect to Home Assistant and react to its events
 */
export const HomeAssistantIntegration =
	(userConfig: HomeAssistantIntegrationConfig): OwlIntegrationFactory =>
	() => {
		const config: HomeAssistantIntegrationResolvedConfig = {
			...defaultConfig,
			...userConfig
		}
		const logger = new Logger([config.name])
		const eventBus = container.resolve<EventBus>(["core", "eventbus"])

		const entitiesCache = new EntitiesCache()
		const managedRegistry = new ManagedRegistry(config.managed ?? [], logger)
		const ws = new HomeAssistantWebsocket(
			config,
			entitiesCache,
			managedRegistry,
			eventBus,
			logger
		)
		managedRegistry.setWebsocket(ws)
		const client = new HomeAssistantClient(ws)

		container.register([config.name, "client"], client)
		container.register([config.name, "client", "websocket"], ws)
		container.register([config.name, "entity", "cache"], entitiesCache)
		container.register([config.name, "entity", "managed"], managedRegistry)

		return {
			name: config.name,

			onStarting: async () => {
				await ws.connect()
			},

			onStopping: async () => {
				ws.close()
			}
		}
	}
