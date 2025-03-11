import type { FilterInput, Filters } from '../../types/filters.type';
import { removeFilterValue } from '../remove-filter-value/remove-filter-value.helper';

export type RemoveMultipleFilterValuesOptions = {
	/**
	 * @description
	 * The filters collection.
	 */
	filters: Filters;
	/**
	 * @description
	 * The filter input or inputs the consumer has passed.
	 *
	 * Each filter input will be removed sequentially.
	 */
	input: FilterInput | Array<FilterInput>;
};

/**
 * @description
 * Use this helper to remove multiple filter values across different filters.
 *
 * - Accepts a single filter input or an array of filter inputs, each containing a filter name and one or more values.
 * - Processes multiple values for a single filter individually.
 *
 * Comparison checks are performed as follows:
 * - Object values are serialized into strings for accurate comparison.
 * - Primitive values (strings, numbers, etc.) are compared directly without serialization.
 *
 * This helper functions as a batch processor, applying `removeFilterValue` efficiently to multiple filters.
 *
 * This helper ensures immutability by creating a shallow copy of the filters collection.
 */
export const removeMultipleFilterValues = (options: RemoveMultipleFilterValuesOptions): Filters => {
	const { filters, input: oInput } = options;

	let updatedFilters: Filters = { ...filters };

	const input = Array.isArray(oInput) ? oInput : [oInput];

	for (const filterInput of input) {
		if (Array.isArray(filterInput.value)) {
			for (const value of filterInput.value) {
				updatedFilters = removeFilterValue({ filters: updatedFilters, name: filterInput.name, value });
			}
		} else {
			updatedFilters = removeFilterValue({ filters, name: filterInput.name, value: filterInput.value });
		}
	}

	return updatedFilters;
};
