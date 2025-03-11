import type { Filters, FilterValue } from '../../types/filters.type';
import { addFilterValue } from '../add-filter-value/add-filter-value.helper';
import { removeFilter } from '../remove-filter/remove-filter.helper';

export type SetFilterValueOptions = {
	/**
	 * @description
	 * The filters collection.
	 */
	filters: Filters;
	/**
	 * @description
	 * The name of the filter which should be updated.
	 */
	name: string;
	/**
	 * @description
	 * The value that is being added or removed to/from the given filter name.
	 */
	value: FilterValue | Array<FilterValue> | null | undefined;
};

/**
 * @description
 * Use this helper to set the value(s) of a given filter.
 *
 * - If `value` is `null`, `undefined`, or an empty array, the filter is removed.
 * - If `value` is a single item, it replaces the existing filter values.
 * - If `value` is an array, all existing filter values are cleared before adding the new ones.
 *
 * This ensures that each filter is updated in a controlled manner:
 * - Existing filter values are first removed using `removeFilterValue`.
 * - New filter values are then added using `addFilterValue`.
 * - If no values remain, `removeFilter` is used to delete the filter entirely.
 *
 * Comparison checks are performed as follows:
 * - Object values are serialized into strings for accurate comparison.
 * - Primitive values (strings, numbers, etc.) are compared directly without serialization.
 *
 * This function maintains immutability by returning a new filters object.
 */
export const setFilterValue = (options: SetFilterValueOptions) => {
	let { filters, name, value: inputValue } = options;

	const shouldFilterBeRemoved = !inputValue || (Array.isArray(inputValue) && inputValue.length === 0);

	if (shouldFilterBeRemoved) {
		return removeFilter({ filters, name });
	}

	filters = removeFilter({ filters, name });

	if (Array.isArray(inputValue)) {
		for (const value of inputValue) {
			filters = addFilterValue({ filters, name, value });
		}
	} else {
		filters = addFilterValue({ filters, name, value: inputValue });
	}

	return filters;
};
