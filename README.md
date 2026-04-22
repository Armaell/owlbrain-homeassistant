# OwlBrain Home Assistant
**Home Assistant integration for OwlBrain — expose entities, react to state changes, and drive automations with TypeScript.**

This integration connects OwlBrain scripts to your Home Assistant instance, allowing you to react to entity state changes and call services.

## Features

- **[HA service calls](./docs/decorators/utility/inject.md)** — Trigger home assistant actions
- **[Entity handles](./docs/decorators/utility/only-if.md)** — Easy access to entities state, attributes and actions
- **[Managed entities](./docs/decorators/utility/only-if.md)** — Using the companion app, create virtual entities controlled from owlbrain
- **[Entity Target](./docs/decorators/utility/delay.md)** — How to select entities

## List of provided decorators
### Script
- **[@EntityScript](./docs/decorators/scripts/entity-script.md)** — Apply default entity to the script's events handlers
### Events
- **[@OnStateChanged](./docs/decorators/events/on-state-changed.md)** — React to entity state change
- **[@OnZoneChanged](./docs//decorators/events/on-zone-changed.md)** — React to entity zone change

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
