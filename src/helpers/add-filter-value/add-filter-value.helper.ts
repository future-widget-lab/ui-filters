import { stringify } from 'flatted';
import type { FilterInput, Filters, FilterValue } from '../../types/filters.type';

export type AddFilterValueOptions = {
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
	 * The value that is being added to the given filter name.
	 */
	value: FilterValue;
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
 * Use this helper to add a new filter value for the specified filter name while ensuring no duplicates are added.
 *
 * Comparison checks are performed as follows:
 * - Object values are serialized into strings for accurate comparison.
 * - Primitives values (strings, numbers, etc.) are compared directly without serialization.
 */
export const addFilterValue = (options: AddFilterValueOptions) => {
	const { filters, name, value, onBeforeAdd, onAfterAdd } = options;

	const filterValues = filters[name] ?? [];

	if (typeof value === 'object') {
		const serializedfilterValues = filterValues.map((previousFilterValue) => {
			return stringify(previousFilterValue);
		});

		const serializedValue = stringify(value);

		const updatedFilterValues = serializedfilterValues.includes(serializedValue)
			? filterValues
			: [...filterValues, value];

		onBeforeAdd?.({ name, value });

		filters[options.name] = updatedFilterValues;

		onAfterAdd?.({ name, value });

		return filters;
	}

	const updatedFilterValues = filterValues.includes(value) ? filterValues : [...filterValues, value];

	onBeforeAdd?.({ name, value });

	filters[options.name] = updatedFilterValues;

	onAfterAdd?.({ name, value });

	return filters;
};
