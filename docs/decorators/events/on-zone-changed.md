# @OnZoneChanged
Allow to listen to state changes on a entity
```ts
@OnZoneChanged({
  entity_id: "person.alex",
  from: "home",
  to: "not_home"
})
```
This example will call the decorated method only when `alex` goes from `home` to `not_home`, meaning is leaving the home.

You can use the whole [EntityTarget](../../entity-target.md) to select which entity to react to.
