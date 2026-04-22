# Calling Home Assistant services
You can call HA services using the provided client

first retrieve using either the container or the [@Inject](https://github.com/Armaell/owlbrain-core/docs/decorators/utility/inject.md) decorator.
```ts
class Ping {
	@OnStart()
	async onStart {
		const homeAssistant = container.resolve<HomeAssistantClient>([
			"homeassistant",
			"client"
		])
	}
}
```
```ts
class BetterPing {
	@Inject(["homeassistant", "client"])
	private ha: HomeAssistantClient
}
```

then use the `action` function
```ts
await this.homeAssistant.action({
  domain: "light",
  service: "turn_on",
  target: { entity_id: "light.kitchen" }
})
```

target is of type [EntityTarget](./entity-target.md)
