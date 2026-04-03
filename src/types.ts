import type { OwlEvent } from "owlbrain-core"
import type { HAStateChangedEvent } from "./client/types"

export interface OwlEntityUpdatedEvent extends OwlEvent, HAStateChangedEvent {}
export interface OwlZoneChangedEvent extends OwlEvent, HAStateChangedEvent {
	from: string
	to: string
}
