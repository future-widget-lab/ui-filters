import type { FilterInput, Filters } from '../../types/filters.type';
import { addFilterValue } from '../add-filter-value/add-filter-value.helper';

export type AddMultipleFilterValuesOptions = {
	/**
	 * @description
	 * The filters collection.
	 */
	filters: Filters;
	/**
	 * @description
	 * The filter input or inputs the consumer has passed.
	 *
	 * Each filter input will be added sequentially.
	 */
	input: FilterInput | Array<FilterInput>;
	/**
	 * A hook that is fired before the value is added to the collection.
	 *
	 * Consumers can use this to perform any kind of side-effects or validation.
	 */
	onBeforeAdd?: (input: FilterInput) => void;
	/**
	 * A hook that is fired after the value is added to the collection.
	 *
	 * Consumers can use this to perform any kind of side-effects.
	 */
	onAfterAdd?: (input: FilterInput) => void;
};

/**
 * @description
 * Use this helper to add multiple filter values across different filters while preventing duplicates.
 *
 * - Accepts a single filter input or an array of filter inputs, each containing a filter name and one or more values.
 * - Processes multiple values for a single filter individually.
 *
 * Comparison checks are performed as follows:
 * - Object values are serialized into strings for accurate comparison.
 * - Primitive values (strings, numbers, etc.) are compared directly without serialization.
 *
 * This helper functions as a batch processor, applying `addFilterValue` efficiently to multiple filters.
 *
 * This helper ensures immutability by creating a shallow copy of the filters collection.
 */
export const addMultipleFilterValues = (options: AddMultipleFilterValuesOptions): Filters => {
	const { filters, input: oInput, onBeforeAdd, onAfterAdd } = options;

	let updatedFilters: Filters = { ...filters };

	const input = Array.isArray(oInput) ? oInput : [oInput];

	for (const filterInput of input) {
		if (Array.isArray(filterInput.value)) {
			for (const value of filterInput.value) {
				updatedFilters = addFilterValue({
					filters: updatedFilters,
					name: filterInput.name,
					value,
					onBeforeAdd,
					onAfterAdd
				});
			}
		} else {
			updatedFilters = addFilterValue({
				filters,
				name: filterInput.name,
				value: filterInput.value,
				onBeforeAdd,
				onAfterAdd
			});
		}
	}

	return updatedFilters;
};
