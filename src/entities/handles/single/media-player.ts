import type { EntityRef } from "./base-handle"
import { BaseEntityHandle } from "./base-handle"

export interface MediaPlayerVolumeOptions {
	volume_level?: number
}

export interface MediaPlayerPlayMediaOptions {
	media_content_id: string
	media_content_type: string
}

export type MediaPlayerState =
	| "playing"
	| "paused"
	| "idle"
	| "off"
	| "unknown"
	| "unavailable"

export function mediaPlayerEntity(
	ref: string | EntityRef | any
): MediaPlayerEntity {
	if (typeof ref === "string") {
		return new MediaPlayerEntity({ entity_id: ref })
	} else if (typeof ref === "object" && "entity_id" in ref) {
		return new MediaPlayerEntity(ref)
	} else {
		return new MediaPlayerEntity(BaseEntityHandle.fromScriptInstance(ref))
	}
}

export class MediaPlayerEntity extends BaseEntityHandle<MediaPlayerState> {
	constructor(ref: Omit<EntityRef, "domain">) {
		super({
			...ref,
			domain: "media_player"
		})
	}

	get volumeLevel(): number | undefined {
		return this.attributes?.volume_level
	}

	get isMuted(): boolean | undefined {
		return this.attributes?.is_volume_muted
	}

	play() {
		return this.action("media_play")
	}

	pause() {
		return this.action("media_pause")
	}

	stop() {
		return this.action("media_stop")
	}

	toggle() {
		return this.action("toggle")
	}

	playMedia(options: MediaPlayerPlayMediaOptions) {
		return this.action("play_media", options)
	}

	setVolumeRaw(level: number) {
		return this.action("volume_set", { volume_level: level })
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
		return this.action("volume_up")
	}

	volumeDown() {
		return this.action("volume_down")
	}

	mute() {
		return this.action("volume_mute", { is_volume_muted: true })
	}

	unmute() {
		return this.action("volume_mute", { is_volume_muted: false })
	}

	toggleMute() {
		return this.action("volume_mute", { is_volume_muted: !this.isMuted })
	}

	nextTrack() {
		return this.action("media_next_track")
	}

	previousTrack() {
		return this.action("media_previous_track")
	}

	turnOn() {
		return this.action("turn_on")
	}

	turnOff() {
		return this.action("turn_off")
	}
}
