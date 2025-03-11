import type { Filters } from '../../types/filters.type';

export type RemoveFilterOptions = {
	/**
	 * @description
	 * The filters collection.
	 */
	filters: Filters;
	/**
	 * @description
	 * The name of the filter that will be removed.
	 */
	name: string;
};

/**
 * @description
 * Use this helper to remove an filter and its associated values from the filters collection.
 */
export const removeFilter = (options: RemoveFilterOptions) => {
	const { filters, name } = options;

	delete filters[name];

	return filters;
};
