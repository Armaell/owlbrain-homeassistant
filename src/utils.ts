/**
 * JSON stringify, but sort the keys before stringify to ensure a stable result
 * */
export function stableJSONStringify(obj: unknown): string {
	if (obj === null || typeof obj !== "object") {
		return JSON.stringify(obj)
	}

	if (Array.isArray(obj)) {
		return "[" + obj.map((v) => this.stableStringify(v)).join(",") + "]"
	}

	const entries = Object.entries(obj as Record<string, unknown>)
		.filter(([, v]) => v !== undefined)
		.sort(([a], [b]) => a.localeCompare(b))

	return (
		"{" +
		entries
			.map(([k, v]) => JSON.stringify(k) + ":" + this.stableStringify(v))
			.join(",") +
		"}"
	)
}
