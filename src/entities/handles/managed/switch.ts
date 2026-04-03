import { SwitchEntity, type SwitchState } from "../single/switch"
import { ManagedEntity } from "./base-mixin"

class ManagedSwitch extends ManagedEntity<typeof SwitchEntity, SwitchState>(
	SwitchEntity
) {}
