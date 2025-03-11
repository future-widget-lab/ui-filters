import type { Filters } from '../../types/filters.type';

export type PeekFilterOptions = {
	/**
	 * @description
	 * The filters collection.
	 */
	filters: Filters;
	/**
	 * The name of the filter to lookup.
	 */
	name: string;
};

/**
 * @description
 * Use this helper to retrieve the current values of a given filter.
 */
export const peekFilter = <TData>(options: PeekFilterOptions) => {
	const { filters, name } = options;

	return (filters[name] ?? []) as Array<TData>;
};
