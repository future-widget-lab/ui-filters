import { parse } from 'flatted';
import type { Filters } from '../../types/filters.type';

export type DeserializeFiltersOptions = {
	/**
	 * @description
	 * The serialized representation of the filters.
	 */
	serializedFilters: string | null;
	/**
	 * @description
	 * Use this helper to create a valid filters collection out of the search parameter value where filters are stored.
	 *
	 * Defaults to flatted's `parse` if not present (See https://www.npmjs.com/package/flatted).
	 */
	deserializer?: (value: string) => Filters;
	/**
	 * A hook that is fired when before the filters collection is deserialized.
	 *
	 * Consumers can use this to perform any kind of side-effects or validation.
	 */
	onBeforeDeserializer?: () => void;
	/**
	 * A hook that is fired when after the filters collection is deserialized.
	 *
	 * Consumers can use this to perform any kind of side-effects.
	 */
	onAfterDeserializer?: (filters: Filters) => void;
	/**
	 * A hook that is fired when an error occurs during the deserialization of the filters collection.
	 *
	 * Consumers can use this to perform any kind of side-effects.
	 */
	onDeserializerError?: (error: Error) => void;
};

/**
 * @description
 * Use this helper to perform the filters deserialization.
 *
 * Return a filters collection given a search params set and a search param name.
 *
 * Returns an empty collection if no search parameter is found or an error occurs.
 */
export const deserializeFilters = (options: DeserializeFiltersOptions): Filters => {
	const {
		serializedFilters,
		deserializer = parse,
		onBeforeDeserializer,
		onAfterDeserializer,
		onDeserializerError
	} = options;

	onBeforeDeserializer?.();

	try {
		if (!serializedFilters) {
			return {} as Filters;
		}

		const parsedFilters = deserializer(serializedFilters);

		onAfterDeserializer?.(parsedFilters);

		return parsedFilters;
	} catch (error) {
		onDeserializerError?.(error as Error);

		return {} as Filters;
	}
};
