import { type EntityTarget, isEntityTarget } from "../../types"
import { BaseEntitiesHandle, type EntitiesRef } from "./base-handle"
import {
	type MediaPlayerPlayMediaOptions,
	mediaPlayerEntity
} from "../single/media-player"

export function mediaPlayerEntities(
	ref: EntityTarget | any
): MediaPlayerEntities {
	if (isEntityTarget(ref)) {
		return new MediaPlayerEntities(ref)
	} else {
		return new MediaPlayerEntities(BaseEntitiesHandle.fromScriptInstance(ref))
	}
}

type MediaPlayerState = "playing" | "paused" | "idle" | "off"

export class MediaPlayerEntities extends BaseEntitiesHandle {
	constructor(ref: EntitiesRef) {
		super(ref)
	}

	get entities() {
		return this.cache
			.resolveTarget(this.target)
			.map((e) => mediaPlayerEntity({ entity_id: e.entity_id }))
	}

	volumeLevels() {
		return this.getAttributesNamed("volume_level")
	}

	mutedStates() {
		return this.getAttributesNamed("is_volume_muted")
	}

	play() {
		return this.action("media_player", "media_play")
	}

	pause() {
		return this.action("media_player", "media_pause")
	}

	stop() {
		return this.action("media_player", "media_stop")
	}

	toggle() {
		return this.action("media_player", "toggle")
	}

	playMedia(options: MediaPlayerPlayMediaOptions) {
		return this.action("media_player", "play_media", options)
	}

	setVolumeRaw(level: number) {
		return this.action("media_player", "volume_set", { volume_level: level })
	}

	setVolumePercent(percent: number) {
		const level = Math.max(0, Math.min(1, percent / 100))
		return this.setVolumeRaw(level)
	}

	setVolume(value: number | { percent: number } | { raw: number }) {
		if (typeof value === "number") {
			return this.setVolumePercent(value)
		}
		if ("percent" in value) {
			return this.setVolumePercent(value.percent)
		}
		if ("raw" in value) {
			return this.setVolumeRaw(value.raw)
		}
	}

	volumeUp() {
		return this.action("media_player", "volume_up")
	}

	volumeDown() {
		return this.action("media_player", "volume_down")
	}

	mute() {
		return this.action("media_player", "volume_mute", { is_volume_muted: true })
	}

	unmute() {
		return this.action("media_player", "volume_mute", {
			is_volume_muted: false
		})
	}

	toggleMute() {
		return this.action("media_player", "volume_mute", { is_volume_muted: true })
	}

	nextTrack() {
		return this.action("media_player", "media_next_track")
	}

	previousTrack() {
		return this.action("media_player", "media_previous_track")
	}

	turnOn() {
		return this.action("media_player", "turn_on")
	}

	turnOff() {
		return this.action("media_player", "turn_off")
	}
}
