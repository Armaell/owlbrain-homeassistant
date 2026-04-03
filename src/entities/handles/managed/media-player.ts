import {
	MediaPlayerEntity,
	type MediaPlayerState
} from "../single/media-player"
import { BaseEntityHandle, type EntityRef } from "../single/base-handle"
import { ManagedEntity } from "./base-mixin"

export function managedMediaPlayerEntity(
	ref: string | EntityRef | any
): ManagedMediaPlayer {
	if (typeof ref === "string") {
		return new ManagedMediaPlayer({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new ManagedMediaPlayer(ref)
	} else {
		return new ManagedMediaPlayer(BaseEntityHandle.fromScriptInstance(ref))
	}
}

class ManagedMediaPlayer extends ManagedEntity<
	typeof MediaPlayerEntity,
	MediaPlayerState
>(MediaPlayerEntity) {}
