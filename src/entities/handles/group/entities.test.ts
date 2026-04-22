import { beforeEach, describe, expect, it, vi } from "vitest"
import { createTestHarness } from "owlbrain-core/test"
import { entities } from "./entities"
import { container } from "owlbrain-core"
import { InvalidTargetError } from "../../../errors"

describe("Entities", () => {
	let containerHarness: ReturnType<typeof createTestHarness>
	let mockClient: any
	let mockCache: any
	let mockScripts: any

	beforeEach(() => {
		containerHarness = createTestHarness()
		Object.assign(container, containerHarness.container)

		mockClient = {
			action: vi.fn().mockResolvedValue({ success: true })
		}

		mockCache = {
			get: vi.fn(),
			resolveTarget: vi.fn()
		}

		mockScripts = {
			getScriptData: vi.fn().mockReturnValue({
				entity_id: ["light.kitchen", "switch.lamp"],
				namespace: "homeassistant"
			})
		}

		containerHarness.register(["homeassistant", "client"], mockClient)
		containerHarness.register(["homeassistant", "entity", "cache"], mockCache)
		containerHarness.register(["core", "scripts"], mockScripts)
	})

	describe("instantiation", () => {
		it("accepts an EntityTarget", () => {
			const target = { entity_id: ["light.kitchen", "switch.lamp"] }
			const e = entities({ entity_id: ["light.kitchen", "switch.lamp"] })

			expect(e.target).toEqual(target)
		})

		it("resolves entity_ids from script instance", () => {
			const target = { entity_id: ["light.kitchen", "switch.lamp"] }
			const namespace = "hass"

			const scriptInstance = {
				scriptData: { ...target, namespace }
			}

			containerHarness.register([namespace, "client"], mockClient)
			containerHarness.register([namespace, "entity", "cache"], mockClient)

			const e = entities(scriptInstance)

			expect(e.target).toEqual(target)
			expect(e.namespace).toBe(namespace)
		})

		it("throws when script instance has no valid target", () => {
			mockScripts.getScriptData.mockReturnValue({
				namespace: "homeassistant"
			})

			expect(() => entities({})).toThrowError(InvalidTargetError)
		})
	})

	describe("get states()", () => {
		it("returns map of states from cache", () => {
			mockCache.resolveTarget.mockImplementation(() => [
				{ entity_id: "light.kitchen", state: "on" },
				{ entity_id: "switch.lamp", state: "off" }
			])

			const e = entities({ entity_id: ["light.kitchen", "switch.lamp"] })

			expect(e.states).toEqual(
				new Map([
					["light.kitchen", "on"],
					["switch.lamp", "off"]
				])
			)
		})
	})

	describe("attributes", () => {
		it("getter returns list of attributes from cache", () => {
			mockCache.resolveTarget.mockImplementation(() => [
				{ entity_id: "light.kitchen", attributes: { brightness: 200 } },
				{ entity_id: "switch.lamp", attributes: { power: "high" } }
			])

			const e = entities({ entity_id: ["light.kitchen", "switch.lamp"] })

			expect(e.attributes).toEqual(
				new Map([
					["light.kitchen", { brightness: 200 }],
					["switch.lamp", { power: "high" }]
				])
			)
		})

		it("getAttributesNamed() returns map of specific attribute from cache", () => {
			mockCache.resolveTarget.mockImplementation(() => [
				{ entity_id: "light.kitchen", attributes: { brightness: 200 } },
				{ entity_id: "switch.lamp", attributes: { power: "high" } }
			])

			const e = entities({ entity_id: ["light.kitchen", "switch.lamp"] })

			expect(e.getAttributesNamed("brightness")).toEqual(
				new Map([
					["light.kitchen", 200],
					["switch.lamp", undefined]
				])
			)
			expect(e.getAttributesNamed("power")).toEqual(
				new Map([
					["light.kitchen", undefined],
					["switch.lamp", "high"]
				])
			)
		})
	})

	describe("action()", () => {
		it("calls client.action() with multiple targets", async () => {
			mockCache.resolveTarget.mockImplementation(() => [
				{ entity_id: "light.kitchen" },
				{ entity_id: "switch.lamp" }
			])

			const e = entities({ entity_id: ["light.kitchen", "switch.lamp"] })

			await e.action("light", "toggle", { foo: 123 })

			expect(mockClient.action).toHaveBeenCalledWith({
				domain: "light",
				service: "toggle",
				data: { foo: 123 },
				target: { entity_id: ["light.kitchen", "switch.lamp"] }
			})
		})
	})
})
