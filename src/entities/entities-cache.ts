import type { HassEntity, HassServiceTarget } from "home-assistant-js-websocket"
import type {
	AreaRegistryEntry,
	EntityRegistryEntry,
	HAAreaRegistryCreatedEvent,
	HAAreaRegistryRemovedEvent,
	HAAreaRegistryUpdatedEvent,
	HAEntity,
	HAEntityRegistryCreatedEvent,
	HAEntityRegistryRemovedEvent,
	HAEntityRegistryUpdatedEvent,
	HAStateChangedEvent
} from "../client/types"

/**
 * Incremental cache of entities state and their registry
 */
export class EntitiesCache {
	// -- Caches for Home Assistant data -- //
	private states = new Map<string, HassEntity>()
	private entities = new Map<string, EntityRegistryEntry>()
	private areas = new Map<string, AreaRegistryEntry>()

	// -- Caches for target resolution -- //
	private matchesCache = new Map<string, boolean>()
	private resolvesCache = new Map<string, HAEntity[]>()

	populate(
		states: HassEntity[],
		entities: EntityRegistryEntry[],
		areas: AreaRegistryEntry[]
	) {
		this.states.clear()
		this.entities.clear()
		this.clearCache()

		for (const s of states) this.states.set(s.entity_id, s)
		for (const e of entities) this.entities.set(e.entity_id, e)
		for (const a of areas) this.areas.set(a.area_id, a)
	}

	get(entity_id: string): HAEntity | undefined {
		const state = this.states.get(entity_id)
		const entity = this.entities.get(entity_id)
		if (!state && !entity) return undefined

		const area = entity?.area_id ? this.areas.get(entity.area_id) : undefined
		return { ...entity, ...state, area } as HAEntity
	}

	*values(): Iterable<HAEntity> {
		for (const entityId of this.entities.keys()) {
			const ent = this.get(entityId)
			if (ent) yield ent
		}
	}

	/**
	 * Check if an entity_id matches the given target
	 */
	matchesTarget(entityId: string, target: HassServiceTarget): boolean {
		const cacheKey = `${entityId}::${JSON.stringify(target)}`
		if (this.matchesCache.has(cacheKey)) {
			return this.matchesCache.get(cacheKey)!
		}

		if (Object.keys(target).length === 0) {
			return true
		}

		const cachedEntity = this.get(entityId)
		if (!cachedEntity) {
			this.matchesCache.set(cacheKey, false)
			return false
		}

		let ok = false

		if (target.entity_id) {
			const ids = Array.isArray(target.entity_id)
				? target.entity_id
				: [target.entity_id]
			ok ||= ids.includes(entityId)
		}

		if (target.device_id) {
			const ids = Array.isArray(target.device_id)
				? target.device_id
				: [target.device_id]
			ok ||= ids.includes(cachedEntity.device_id!)
		}

		if (target.area_id) {
			const ids = Array.isArray(target.area_id)
				? target.area_id
				: [target.area_id]
			ok ||= ids.includes(cachedEntity.area_id!)
		}

		if (target.label_id) {
			const ids = Array.isArray(target.label_id)
				? target.label_id
				: [target.label_id]
			ok ||= ids.some((id) => cachedEntity.labels?.includes(id))
		}

		if (target.floor_id) {
			const ids = Array.isArray(target.floor_id)
				? target.floor_id
				: [target.floor_id]
			const floorId = cachedEntity.area?.floor_id
			ok ||= floorId != null && ids.includes(floorId)
		}

		this.matchesCache.set(cacheKey, ok)
		return ok
	}

	/**
	 * Retrieve all entities matching the target
	 */
	resolveTarget(target: HassServiceTarget): HAEntity[] {
		const cacheKey = JSON.stringify(target)
		if (this.resolvesCache.has(cacheKey)) {
			return this.resolvesCache.get(cacheKey)!
		}

		const result: HAEntity[] = []

		for (const entity of this.values()) {
			if (this.matchesTarget(entity.entity_id, target)) result.push(entity)
		}

		this.resolvesCache.set(cacheKey, result)
		return result
	}

	updateFromStateChangedEvent(ev: HAStateChangedEvent) {
		const entityId = ev.data.entity_id

		if (ev.data.new_state) {
			this.states.set(entityId, ev.data.new_state)
		} else {
			this.states.delete(entityId)
		}

		this.clearCache()
	}

	createFromEntityRegistryEvent(event: HAEntityRegistryCreatedEvent) {
		const entry = event.data.entity_entry

		this.entities.set(entry.entity_id, entry)

		this.clearCache()
	}

	updateFromEntityRegistryEvent(event: HAEntityRegistryUpdatedEvent) {
		const { entity_id, changes } = event.data
		const existing = this.entities.get(entity_id)
		if (!existing) return

		const updated: EntityRegistryEntry = {
			...existing,
			...changes
		}

		this.entities.set(entity_id, updated)

		this.clearCache()
	}

	removeFromEntityRegistryEvent(event: HAEntityRegistryRemovedEvent) {
		const { entity_id } = event.data

		this.entities.delete(entity_id)
		this.states.delete(entity_id)

		this.clearCache()
	}

	updateFromAreaRegistryEvent(event: HAAreaRegistryUpdatedEvent) {
		const { area_id, changes } = event.data
		const existing = this.areas.get(area_id)
		if (!existing) return

		this.areas.set(area_id, { ...existing, ...changes })
		this.clearCache()
	}

	createFromAreaRegistryEvent(event: HAAreaRegistryCreatedEvent) {
		const area = event.data.area
		this.areas.set(area.area_id, area)
		this.clearCache()
	}

	removeFromAreaRegistryEvent(event: HAAreaRegistryRemovedEvent) {
		this.areas.delete(event.data.area_id)
		this.clearCache()
	}

	private clearCache() {
		this.matchesCache.clear()
		this.resolvesCache.clear()
	}
}
