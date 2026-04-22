# Entity Target
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
This will control any entity matching any of those rules

## Example
```json
{
	entity_id: "switch.garden_water_valve",
	label_id: ["front_hedge", "lawn"]
}
```
This will match the one entity `switch.garden_water_valve` and any other entity either the label `front_hedge`, `lawn`. Perfect to start controlled watering.
