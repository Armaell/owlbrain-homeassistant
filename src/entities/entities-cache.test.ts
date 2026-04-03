import { beforeEach, describe, expect, it } from "vitest"
import type { HassEntity, HassServiceTarget } from "home-assistant-js-websocket"
import { EntitiesCache } from "./entities-cache"
import type { AreaRegistryEntry, EntityRegistryEntry } from "../client/types"

const makeState = (id: string): HassEntity => ({
	entity_id: id,
	state: "on",
	attributes: {},
	last_changed: "",
	last_updated: "",
	context: { id: "", parent_id: null, user_id: null }
})

const makeReg = (
	id: string,
	extra: Partial<EntityRegistryEntry> = {}
): EntityRegistryEntry => ({
	id,
	entity_id: id,
	unique_id: id,
	device_id: null,
	area_id: null,
	floor_id: null,
	labels: [],
	name: null,
	original_name: null,
	...extra
})

const makeArea = (id: string): AreaRegistryEntry => ({
	area_id: id,
	name: id,
	aliases: [],
	floor_id: null,
	icon: null
})

describe("EntitiesCache", () => {
	let cache: EntitiesCache

	beforeEach(() => {
		cache = new EntitiesCache()

		cache.populate(
			[
				makeState("light.kitchen"),
				makeState("light.living"),
				makeState("sensor.temp")
			],
			[
				makeReg("light.kitchen", { device_id: "devA", area_id: "kitchen" }),
				makeReg("light.living", { device_id: "devB", area_id: "living" }),
				makeReg("sensor.temp", { device_id: "devA", area_id: "kitchen" })
			],
			[makeArea("kitchen"), makeArea("living")]
		)
	})

	describe("matchesTarget", () => {
		const matchCases: {
			name: string
			entityId: string
			target: HassServiceTarget
			expected: boolean
		}[] = [
			{
				name: "match by entity_id",
				entityId: "light.kitchen",
				target: { entity_id: "light.kitchen" },
				expected: true
			},
			{
				name: "no match by entity_id",
				entityId: "light.living",
				target: { entity_id: "light.kitchen" },
				expected: false
			},
			{
				name: "match by device_id",
				entityId: "sensor.temp",
				target: { device_id: "devA" },
				expected: true
			},
			{
				name: "no match by device_id",
				entityId: "light.living",
				target: { device_id: "devA" },
				expected: false
			},
			{
				name: "match by area_id",
				entityId: "light.living",
				target: { area_id: "living" },
				expected: true
			},
			{
				name: "match with array entity_id",
				entityId: "sensor.temp",
				target: { entity_id: ["light.kitchen", "sensor.temp"] },
				expected: true
			},
			{
				name: "empty target always true",
				entityId: "unknown.entity",
				target: {},
				expected: true
			},
			{
				name: "unknown entity always false",
				entityId: "unknown.entity",
				target: { device_id: "devA" },
				expected: false
			}
		]

		matchCases.forEach((tc) => {
			it(tc.name, () => {
				expect(cache.matchesTarget(tc.entityId, tc.target)).toBe(tc.expected)
			})
		})
	})

	describe("resolveTarget", () => {
		const resolveCases: {
			name: string
			target: HassServiceTarget
			expected: string[]
		}[] = [
			{
				name: "resolve by entity_id",
				target: { entity_id: "light.kitchen" },
				expected: ["light.kitchen"]
			},
			{
				name: "resolve by device_id",
				target: { device_id: "devA" },
				expected: ["light.kitchen", "sensor.temp"]
			},
			{
				name: "resolve by area_id",
				target: { area_id: "living" },
				expected: ["light.living"]
			},
			{
				name: "resolve array entity_id",
				target: { entity_id: ["sensor.temp", "light.living"] },
				expected: ["sensor.temp", "light.living"]
			}
		]

		resolveCases.forEach((tc) => {
			it(tc.name, () => {
				const res = cache.resolveTarget(tc.target)
				expect(res.map((e) => e.entity_id).sort()).toEqual(tc.expected.sort())
			})
		})
	})
})
