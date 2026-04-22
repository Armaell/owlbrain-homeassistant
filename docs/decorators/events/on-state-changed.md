# @OnStateChanged
Allow to listen to state changes on a entity
```ts
@OnStateChanged({
  entity_id: "light.kitchen",
  from: "on",
  to: "off"
})
```
This example will call the decorated method only when the `light.kitchen` goes from `on` to `off`.

You can use the whole [EntityTarget](../../entity-target.md) to select which entity to react to.
