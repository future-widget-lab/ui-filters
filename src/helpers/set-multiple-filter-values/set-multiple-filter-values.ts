import type { AnyFilterInput, Filters } from '../../types/filters.type';
import { setFilterValue } from '../set-filter-value/set-filter-value.helper';

export type SetMultipleFilterValuesOptions = {
	/**
	 * @description
	 * The filters collection.
	 */
	filters: Filters;
	/**
	 * @description
	 * The filter input or inputs the consumer has passed.
	 *
	 * Each filter input will be set sequentially.
	 */
	input: AnyFilterInput | Array<AnyFilterInput>;
};

/**
 * @description
 * Use this helper to set multiple filter values across different filters while preventing duplicates.
 *
 * - Accepts a single filter input or an array of filter inputs, each containing a filter name and one or more values.
 * - Processes multiple values for a single filter individually.
 *
 * - If `value` is `null`, `undefined`, or an empty array, the filter is removed.
 * - If `value` is a single item, it replaces the existing filter values.
 * - If `value` is an array, all existing filter values are cleared before adding the new ones.
 *
 * Comparison checks are performed as follows:
 * - Object values are serialized into strings for accurate comparison.
 * - Primitive values (strings, numbers, etc.) are compared directly without serialization.
 *
 * This helper functions as a batch processor, applying `setFilterValue` efficiently to multiple filters.
 *
 * This helper ensures immutability by creating a shallow copy of the filters collection.
 */
export const setMultipleFilterValues = (options: SetMultipleFilterValuesOptions): Filters => {
	const { filters, input: oInput } = options;

	let updatedFilters: Filters = { ...filters };

	const input = Array.isArray(oInput) ? oInput : [oInput];

	for (const filterInput of input) {
		updatedFilters = setFilterValue({ filters, name: filterInput.name, value: filterInput.value });
	}

	return updatedFilters;
};
