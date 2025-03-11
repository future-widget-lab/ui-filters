import type { Filters } from '../../types/filters.type';
import { removeFilter } from '../remove-filter/remove-filter.helper';

export type RemoveMultipleFilterOptions = {
	/**
	 * @description
	 * The seed filters to be updated.
	 */
	filters: Filters;
	/**
	 * @description
	 * The filter input or inputs the consumer has passed.
	 *
	 * Each filter input will be removed sequentially.
	 */
	input: string | Array<string>;
};

/**
 * @description
 * Use this helper to remove multiple filters from the given filters collection.
 *
 * - Accepts a single filter name or an array of filter names.
 * - Each filter is removed sequentially.
 *
 * This helper functions as a batch processor, applying `removeFilter` efficiently to multiple filters.
 *
 * This helper ensures immutability by creating a shallow copy of the filters collection.
 */
export const removeMultipleFilters = (options: RemoveMultipleFilterOptions): Filters => {
	const { filters, input: oInput } = options;

	let updatedFilters: Filters = { ...filters };

	const input = Array.isArray(oInput) ? oInput : [oInput];

	for (const name of input) {
		updatedFilters = removeFilter({ filters, name });
	}

	return updatedFilters;
};
