import { SwitchEntity, type SwitchState } from "../single/switch"
import { ManagedEntity } from "./base-mixin"

export class ManagedSwitch extends ManagedEntity<
	typeof SwitchEntity,
	SwitchState
>(SwitchEntity) {}
