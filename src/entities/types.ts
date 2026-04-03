import { z } from "zod"

const TypeSchema = z.union([z.string(), z.array(z.string())]).optional()

export const EntityTargetSchema = z
	.object({
		area_id: TypeSchema,
		device_id: TypeSchema,
		entity_id: TypeSchema,
		floor_id: TypeSchema,
		label_id: TypeSchema
	})
	.refine(
		(obj) =>
			obj.area_id !== undefined ||
			obj.device_id !== undefined ||
			obj.entity_id !== undefined ||
			obj.floor_id !== undefined ||
			obj.label_id !== undefined,
		{ message: "At least one field must be provided" }
	)

export type EntityTarget = z.infer<typeof EntityTargetSchema>

export const isEntityTarget = (value: unknown): value is EntityTarget => {
	return EntityTargetSchema.safeParse(value).success
}
