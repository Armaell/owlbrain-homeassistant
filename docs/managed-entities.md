# Managed entities

You can create entities in Home Assistant from your owlbrain script using the [companion app](https://github.com/Armaell/owlbrain-homeassistant-companion).

Once installed you can create entities like this:
```ts
HomeAssistantIntegration({
    ...,
    managed: [
      {
        entity_id: "select.word",
        name: "Please select the word of the day:",
        options: ["Hi", "Salut", "Hola", "Hei", "Namaste", "Osu"]
      },
      {
        device_id: "some_device",
        name: "Big device",
        entities: [
          {
            entity_id: "sensor.super",
            name: "My super sensor"
          }
        ]
      }
    ]
  })
```
Then to set the state, you can use an handle like `managedSensorEntity`, `managedBinarySensorEntity`, `managedSwitchEntity`

Those are the same handles than single entity handle, but also exposes a `setState()` function.
