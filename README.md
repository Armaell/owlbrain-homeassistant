# OwlBrain Home Assistant
**Home Assistant integration for OwlBrain — expose entities, react to state changes, and drive automations with TypeScript.**

This integration connects OwlBrain scripts to your Home Assistant instance, allowing you to react to entity state changes and call services.

## Features

### @EntityScript script decorator
Use `@EntityScript()` on a script class to configure:

- a default target for the script, you can use the whole [EntityTarget](#entity-target) selector.
- all the other options of the `@Script()` decorator

```ts
@EntityScript({
  entity_id: "light.kitchen",
})
export class LightsAutomation {
  // all events handlers will listen to "light.kitchen" by default
}
```

> [!NOTE]
> The particular decorator is optional and only serves to configure script-wide parameters. In most case the default `@Script()` class decorator is enough.

### @OnStateChanged() event decorator
Allow to listen to state changes on a entity
```ts
@OnStateChanged({
  entity_id: "light.kitchen",
  from: "on",
  to: "off"
})
```
This example will call the decorated method only when the "light.kitchen" goes from "on" to "off".

You can use the whole [EntityTarget](#entity-target) to select which entity to react to.

### @OnZoneChanged() event decorator
Allow to listen to state changes on a entity
```ts
@OnZoneChanged({
  entity_id: "person.alex",
  from: "on",
  to: "off"
})
```
This example will call the decorated method only when the "light.kitchen" goes from "on" to "off".

You can use the whole [EntityTarget](#entity-target) to select which entity to react to.

### Calling Home Assistant services
You can call HA services using the provided client:

```ts
homeAssistant = container.resolve<HomeAssistantClient>([
  "homeassistant",
  "client"
])
await this.homeAssistant.action({
  domain: "light",
  service: "turn_on",
  target: { entity_id: "light.kitchen" }
})
```

target is of type [EntityTarget](#entity-target)

### Use entity handles
Utility classes are available for most common entity types: `buttonEntity`, `climateEntity`, `coverEntity`, `entity`, `lightEntity`, `lockEntity`, `mediaPlayerEntity`,`personEntity`, `sensorEntity`, `binarySensorEntity`, `sunEntity`, `switchEntity`, `vacuumEntity`.

They allow to make simpler service calls:

```ts
const light = lightEntity("light.kitchen")
light.turnOn()
```

It also exist handles for multiple entities that takes a [EntityTarget](#entity-target) as selector: `buttonsEntities`, `climatesEntities`, `coversEntities`, `entities`, `lightsEntities`, `locksEntities`, `mediaPlayersEntities`,`personsEntities`, `sensorsEntities`, `binarySensorsEntities`, `switchesEntities`, `vacuumEntities`.

### Managed entities

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

### Entity Target
You can target entities either directly by their entity_id, or by some other information:
```ts
type EntityTarget = {
    area_id?: string | string[];
    device_id?: string | string[];
    entity_id?: string | string[];
    floor_id?: string | string[];
    label_id?: string | string[];
}
```
## Quickstart

### Install
```bash
npm install owlbrain-core owlbrain-homeassistant
```


### Enable the Home Assistant integration

```ts
import { OwlBrain } from "owlbrain-core"
import { HomeAssistantIntegration } from "owlbrain-homeassistant"

async function main() {
  await OwlBrain.withIntegration(
    HomeAssistantIntegration({
        host: "http://homeassistant.local:8123",
        token: process.env.HA_TOKEN
      })
  ).run()
}
```

### Create a script reacting to Home Assistant events

```ts
import { Script } from "owlbrain-core"
import { HomeAssistant, OnStateChanged } from "owlbrain-homeassistant"

@Script()
export class MotionScript extends Script {

  @OnStateChanged({ entity_id: "binary_sensor.motion_hallway", to: "on" })
  async onHallwayMotion(event) {
    await this.homeAssistant.action({
      domain: "light",
      service: "turn_on",
      target: { entity_id: "light.hallway" }
    })
  }
}
```

This automatically reacts to:

- `state_changed` events to "on" for `binary_sensor.motion_hallway`
- Calls the `light.turn_on` service when motion is detected

---

## Examples
You can finds usage examples in the `examples/` folder and run them with `npm run example <example-name>`

#### Examples list
##### Features Highlight
These examples highlight one particular feature per example file:
- **[basic](./examples/features/basic/index.ts)** — Minimal example
- **[single-entity-handles](./examples/features/single-entity-handles/index.ts)** and **[multi-entities-handles](./examples/features/multi-entities-handles/index.ts)** — Use handles to easily call services on entities
- **[managed-entity](./examples/features/managed-entity/index.ts)** — Create an entity with managed state
- **[shared-script](./examples/features/shared-script/index.ts)** — Reuse a script to share behavior for multiple entities
- **[zone-change](./examples/features/zone-change/index.ts)** — Listen to zone changes

##### Full Practical
More complexes examples trying to simulate more realistic use-cases:
- **[home-away](./examples/practical/home-away/index.ts)** — Memorize entities states when someone leave home, and turn them back on when coming back

##### More
Also find more examples on [owlbrain-core](https://github.com/Armaell/owlbrain-core) package
