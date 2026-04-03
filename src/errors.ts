import { OwlError } from "owlbrain-core"
import { EntityTargetSchema } from "./entities/types"

export class IncorrectEntityDomainError extends OwlError {
	public readonly entity_id: string
	public readonly expectedDomain: string
	constructor(args: {
		namespace?: string[]
		entity_id: string
		expectedDomain: string
	}) {
		super({
			namespace: args.namespace,
			message: `Could not handle entity ${args.entity_id} using domain ${args.expectedDomain}.`
		})
		this.entity_id = args.entity_id
		this.expectedDomain = args.expectedDomain
	}
}

export class ConnectionError extends OwlError {
	constructor(args: { namespace?: string[]; cause?: unknown }) {
		super({
			namespace: args.namespace,
			message: `Could not connect to the home assistant server.`,
			cause: args.cause
		})
	}
}

export class InvalidTargetError extends OwlError {
	constructor(args: { namespace?: string[]; cause?: unknown }) {
		super({
			namespace: args.namespace,
			message: `Target entity must define at least a ${InvalidTargetError.possibleFields}`,
			cause: args.cause
		})
	}

	private static get possibleFields() {
		return InvalidTargetError.joinOr(Object.keys(EntityTargetSchema.shape))
	}

	private static joinOr(arr: string[]) {
		return arr.length <= 1
			? arr.join("")
			: `${arr.slice(0, -1).join(", ")} or ${arr.at(-1)}`
	}
}

export class MissingEntityIdInScriptDataError extends OwlError {
	constructor(args: { namespace?: string[]; cause?: unknown }) {
		super({
			namespace: args.namespace,
			message: `Could not find a entity_id defined by the script decorator. Ensure you are using the class decorator @EntityScript() and are defining a 'entity_id'`,
			cause: args.cause
		})
	}
}

export class NotConnectedError extends OwlError {
	constructor(args: { namespace?: string[]; cause?: unknown }) {
		super({
			namespace: args.namespace,
			message: `The integration tried to communicate with Home Assistant while not yet connected. This is an internal bug`,
			cause: args.cause
		})
	}
}

export class CompanionNotAvailableError extends OwlError {
	constructor(args: { namespace?: string[]; cause?: unknown }) {
		super({
			namespace: args.namespace,
			message: `Could not create or update managed entities in Home Assistant. The companion integration does not seems to be installed in Home Assistant. Install it following the instructions at https://github.com/Armaell/owlbrain-homeassistant-companion.`,
			cause: args.cause
		})
	}
}
