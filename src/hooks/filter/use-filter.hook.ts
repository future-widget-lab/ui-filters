import { useFilters } from '../../providers/filters/filters.provider';

/**
 * @description
 * Use this helper to retrieve the current values of a given filter.
 */
export const useFilter = <TData>(name: string) => {
	const { getFilterValues } = useFilters();

	return getFilterValues<TData>(name);
};
