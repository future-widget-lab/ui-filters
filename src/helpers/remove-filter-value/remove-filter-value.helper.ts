import { stringify } from 'flatted';
import type { Filters, FilterValue } from '../../types/filters.type';
import { removeFilter } from '../remove-filter/remove-filter.helper';

export type RemoveFilterValueOptions = {
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
	 * The value that is being removed from the given filter name.
	 */
	value: FilterValue;
};

/**
 * @description
 * Use this helper to remove an existing filter value from the specified filter name.
 *
 * Comparison checks are performed as follows:
 * - Object values are serialized into strings for accurate comparison.
 * - Primitives values (strings, numbers, etc.) are compared directly without serialization.
 */
export const removeFilterValue = (options: RemoveFilterValueOptions) => {
	const { filters, name, value } = options;

	const filterValues = filters[name] ?? [];

	if (filterValues.length === 0) {
		return filters;
	}

	if (typeof value === 'object') {
		const updatedFilterValues = filterValues.filter((previousFilterValue) => {
			if (typeof previousFilterValue === 'object') {
				return stringify(previousFilterValue) !== stringify(value);
			}

			return previousFilterValue !== stringify(value);
		});

		if (updatedFilterValues.length === 0) {
			return removeFilter({ filters, name: options.name });
		}

		filters[options.name] = updatedFilterValues;

		return filters;
	}

	const updatedFilterValues = filterValues.filter((previousFilterValue) => {
		if (typeof previousFilterValue === 'object') {
			return stringify(previousFilterValue) !== value;
		}

		return previousFilterValue !== value;
	});

	if (updatedFilterValues.length === 0) {
		return removeFilter({ filters, name: options.name });
	}

	filters[options.name] = updatedFilterValues;

	return filters;
};
