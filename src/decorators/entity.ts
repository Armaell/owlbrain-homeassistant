import { buildScriptDecorator } from "owlbrain-core/integration"
import z from "zod"

const InjectableAsSchema = z
	.array(z.string())
	.min(1)
	.refine((arr): arr is ["script", ...string[]] => arr[0] === "script", {
		message: 'First element must be "script"'
	})

export const EntityDecoratorConfigSchema = z
	.object({
		area_id: z.union([z.string(), z.array(z.string())]),
		device_id: z.union([z.string(), z.array(z.string())]),
		entity_id: z.union([z.string(), z.array(z.string())]),
		label_id: z.union([z.string(), z.array(z.string())]),

		namespace: z.string(),
		injectableAs: InjectableAsSchema
	})
	.partial()
	.optional()

export type EntityDecoratorConfig = z.infer<typeof EntityDecoratorConfigSchema>

export const EntityScript = buildScriptDecorator(
	async (scriptData: EntityDecoratorConfig) => {
		return {
			scriptData
		}
	}
)
