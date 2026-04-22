# @EntityScript
Use it on a script class to configure:

- a default target for the script, you can use the whole [EntityTarget](../../entity-target.md) selector.
- all the other options of the [@Script()](https://github.com/Armaell/owlbrain-core/docs/decorators/scripts/script.md) decorator

```ts
@EntityScript({
  entity_id: "light.kitchen",
})
export class LightsAutomation {
  // all events handlers will listen to "light.kitchen" by default
  @OnStateChange({ to: "on" })
  async onTurningOn(event: OwlEntityUpdatedEvent) { ... }
}
```

> [!NOTE]
> The particular decorator is optional and only serves to configure script-wide parameters. In most case the default [@Script()](https://github.com/Armaell/owlbrain-core/docs/decorators/scripts/script.md) class decorator is enough.
