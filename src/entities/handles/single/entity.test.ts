import { beforeEach, describe, expect, it, vi } from "vitest"
import { createTestHarness } from "owlbrain-core/test"
import { entity } from "./entity"
import { container } from "owlbrain-core"
import { MissingEntityIdInScriptDataError } from "../../../errors"

describe("Entity", () => {
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
			get: vi.fn()
		}

		mockScripts = {
			getScriptData: vi.fn().mockReturnValue({
				entity_id: "light.kitchen",
				namespace: "homeassistant"
			})
		}

		containerHarness.register(["homeassistant", "client"], mockClient)
		containerHarness.register(["homeassistant", "entity", "cache"], mockCache)
		containerHarness.register(["core", "scripts"], mockScripts)
	})

	describe("instantiation", () => {
		it("should never throw IncorrectEntityDomainError", () => {
			expect(() => entity("light.kitchen")).not.toThrow()
			expect(() => entity("sensor.temperature")).not.toThrow()
		})

		it("resolves entity_id from script instance", () => {
			const scriptInstance = {
				scriptData: {
					entity_id: "light.kitchen"
				}
			}

			const e = entity(scriptInstance)

			expect(e.entity_id).toBe("light.kitchen")
			expect(e.namespace).toBe("homeassistant")
		})

		it("throws when script instance has no entity_id", () => {
			mockScripts.getScriptData.mockReturnValue({
				namespace: "homeassistant"
			})

			expect(() => entity({})).toThrowError(MissingEntityIdInScriptDataError)
		})

		describe("when script instance's entity_id is an array", () => {
			it("throws it has one entity_id", () => {
				const scriptInstance = {
					scriptData: {
						entity_id: ["light.kitchen"]
					}
				}

				const e = entity(scriptInstance)

				expect(e.entity_id).toBe("light.kitchen")
				expect(e.namespace).toBe("homeassistant")
			})

			it("throws it has multiple entity_id", () => {
				const scriptInstance = {
					scriptData: {
						entity_id: ["light.kitchen", "light.hallway"]
					}
				}

				expect(() => entity(scriptInstance)).toThrowError(
					MissingEntityIdInScriptDataError
				)
			})
		})
	})

	describe("getStatus()", () => {
		it("returns cached object", () => {
			mockCache.get.mockReturnValue({ state: "on" })

			const e = entity("light.kitchen")

			expect(e.status).toEqual({ state: "on" })
		})
	})

	describe("get state()", () => {
		it("returns cached state string", () => {
			mockCache.get.mockReturnValue({ state: "off" })

			const e = entity("light.kitchen")

			expect(e.state).toBe("off")
		})
	})

	describe("is()", () => {
		it("true when state matches", () => {
			mockCache.get.mockReturnValue({ state: "on" })

			const e = entity("light.kitchen")
			expect(e.is("on")).toBe(true)
		})

		it("false when state does not match", () => {
			mockCache.get.mockReturnValue({ state: "off" })

			const e = entity("light.kitchen")
			expect(e.is("on")).toBe(false)
		})
	})

	describe("action()", () => {
		it("calls client.action() with pre-filled parameters", async () => {
			const e = entity("light.kitchen")

			await e.action("toggle", { brightness: 120 })

			expect(mockClient.action).toHaveBeenCalledWith({
				domain: "light",
				service: "toggle",
				data: { brightness: 120 },
				target: { entity_id: "light.kitchen" }
			})
		})
	})

	describe("get attributes()", () => {
		it("returns cached attributes", () => {
			mockCache.get.mockReturnValue({
				attributes: { brightness: 200 }
			})

			const e = entity("light.kitchen")

			expect(e.attributes).toEqual({ brightness: 200 })
		})
	})
})
