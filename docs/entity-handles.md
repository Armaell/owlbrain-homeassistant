# Entity handles
## Single entity
Utility classes are available for most common entity types: `buttonEntity`, `climateEntity`, `coverEntity`, `entity`, `lightEntity`, `lockEntity`, `mediaPlayerEntity`,`personEntity`, `sensorEntity`, `binarySensorEntity`, `sunEntity`, `switchEntity`, `vacuumEntity`.

They allow to make simpler service calls:

```ts
const light = lightEntity("light.kitchen")
light.turnOn()
```

## Multiple entities
It also exist handles for multiple entities taking a [EntityTarget](./entity-target) as selector: `buttonsEntities`, `climatesEntities`, `coversEntities`, `entities`, `lightsEntities`, `locksEntities`, `mediaPlayersEntities`,`personsEntities`, `sensorsEntities`, `binarySensorsEntities`, `switchesEntities`, `vacuumEntities`.


```ts
const covers = coversEntities({area_id: "ground_floor"})
covers.close()
```
