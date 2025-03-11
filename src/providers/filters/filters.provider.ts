import { createContextProvider } from '@future-widget-lab/react-context-provider';
import { setMultipleFilterValues } from '../../helpers/set-multiple-filter-values/set-multiple-filter-values';
import type { AnyFilterInput, Commitable, CommitFunction, Filters } from '../../types/filters.type';
import { removeMultipleFilters } from '../../helpers/remove-multiple-filters/remove-multiple-filters.helper';
import { addMultipleFilterValues } from '../../helpers/add-multiple-filter-values/add-multiple-filter-values.helper';
import { removeMultipleFilterValues } from '../../helpers/remove-multiple-filter-values/remove-multiple-filter-values';
import type { FilterInput } from '../../types/filters.type';
import { syncState } from '../../helpers/sync-state/sync-state.helper';
import { peekFilter } from '../../helpers/peek-filter/peek-filter.helper';
import {
	deserializeFilters,
	DeserializeFiltersOptions
} from '../../helpers/deserialize-filters/deserialize-filters.helper';
import { useMemo } from 'react';

export type AddFilterValueOptions = Commitable<{
	/**
	 * @description
	 * The new filter value to add.
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
}>;

export type RemoveFilterValueOptions = Commitable<{
	/**
	 * @description
	 * The filter value to remove.
	 */
	input: FilterInput | Array<FilterInput>;
}>;

export type SetFilterValueOptions = Commitable<{
	/**
	 * @description
	 * The new filter value to set.
	 */
	input: AnyFilterInput | Array<AnyFilterInput>;
}>;

export type DestroyFilterOptions = Commitable<{
	/**
	 * @description
	 * The filter value to destroy.
	 */
	name: string | Array<string>;
}>;

export type DestroyFiltersOptions = Commitable<{}>;

export type FiltersContext = {
	/**
	 * @description
	 * Use this helper to add a new filter value for the specified filter name.
	 *
	 * @example
	 * import { useSearchParams } from 'react-router';
	 *
	 * const [searchParams] = useSearchParams();
	 *
	 * const commit = (q: string) => {
	 * 	setSearchParams((previousSearchParams) => {
	 * 		previousSearchParams.set('q', q!);
	 *
	 * 		return previousSearchParams;
	 * 	});
	 * };
	 *
	 * addFilterValue({ name: 'bankingAccountIds', value: '550e8400-e29b-41d4-a716-446655440000', commit });
	 *
	 * @example
	 * import { useSearchParams } from 'react-router';
	 *
	 * const [searchParams] = useSearchParams();
	 *
	 * const commit = (q: string) => {
	 * 	setSearchParams((previousSearchParams) => {
	 * 		previousSearchParams.set('q', q!);
	 *
	 * 		return previousSearchParams;
	 * 	});
	 * };
	 *
	 * addFilterValue({ name: 'date', value: { 'start':'11-27-2023', 'end':'12-27-2023', 'dateRangeName': 'Last30Days', 'timezone':'local' }, commit });
	 *
	 * @example
	 * import { useSearchParams } from 'react-router';
	 *
	 * const [searchParams] = useSearchParams();
	 *
	 * const commit = (q: string) => {
	 * 	setSearchParams((previousSearchParams) => {
	 * 		previousSearchParams.set('q', q!);
	 *
	 * 		return previousSearchParams;
	 * 	});
	 * };
	 *
	 * addFilterValue({ name: FilterName.BankingAccountIds, value: bankingAccountId, commit });
	 */
	addFilterValue: (options: AddFilterValueOptions) => void | Promise<void>;
	/**
	 * @description
	 * Use this helper to remove a value from the given filter.
	 *
	 * @example
	 * import { useSearchParams } from 'react-router';
	 *
	 * const [searchParams, setSearchParams] = useSearchParams();
	 *
	 * const commit: CommitFunction = (q) => {
	 * 	if (!q) {
	 * 		setSearchParams(new URLSearchParams());
	 *
	 * 		return;
	 * 	}
	 *
	 * 	setSearchParams((previousSearchParams) => {
	 * 		previousSearchParams.set('q', q!);
	 *
	 * 		return previousSearchParams;
	 * 	});
	 * };
	 *
	 * removeFilterValue({ name: 'bankingAccountIds', value: '550e8400-e29b-41d4-a716-446655440000', commit });
	 */
	removeFilterValue: (options: RemoveFilterValueOptions) => void | Promise<void>;
	/**
	 * @description
	 * Use this helper to set the value(s) of a given filter.
	 *
	 * - If `value` is `null`, `undefined`, or an empty array, the filter is removed.
	 * - If `value` is a single item, it replaces the existing filter values.
	 * - If `value` is an array, all existing filter values are cleared before adding the new ones.
	 *
	 * @example
	 * import { useSearchParams } from 'react-router';
	 *
	 * const [searchParams, setSearchParams] = useSearchParams();
	 *
	 * const commit: CommitFunction = (q) => {
	 * 	if (!q) {
	 * 		setSearchParams(new URLSearchParams());
	 *
	 * 		return;
	 * 	}
	 *
	 * 	setSearchParams((previousSearchParams) => {
	 * 		previousSearchParams.set('q', q!);
	 *
	 * 		return previousSearchParams;
	 * 	});
	 * };
	 *
	 * setFilterValue({ name: 'bankingAccountIds', value: '550e8400-e29b-41d4-a716-446655440000', commit });
	 *
	 * @example
	 * import { useSearchParams } from 'react-router';
	 *
	 * const [searchParams, setSearchParams] = useSearchParams();
	 *
	 * const commit: CommitFunction = (q) => {
	 * 	if (!q) {
	 * 		setSearchParams(new URLSearchParams());
	 *
	 * 		return;
	 * 	}
	 *
	 * 	setSearchParams((previousSearchParams) => {
	 * 		previousSearchParams.set('q', q!);
	 *
	 * 		return previousSearchParams;
	 * 	});
	 * };
	 *
	 * setFilterValue({ name: 'bankingAccountIds', value: null, commit });
	 */
	setFilterValue: (options: SetFilterValueOptions) => Promise<void>;
	/**
	 * @description
	 * Use this helper to remove a filter and its associated values from the filters collection.
	 *
	 * @example
	 * import { useSearchParams } from 'react-router';
	 *
	 * const [searchParams, setSearchParams] = useSearchParams();
	 *
	 * const commit: CommitFunction = (q) => {
	 * 	if (!q) {
	 * 		setSearchParams(new URLSearchParams());
	 *
	 * 		return;
	 * 	}
	 *
	 * 	setSearchParams((previousSearchParams) => {
	 * 		previousSearchParams.set('q', q!);
	 *
	 * 		return previousSearchParams;
	 * 	});
	 * };
	 *
	 * destroyFilter({ name: 'cart-items', commit });
	 */
	destroyFilter: (options: DestroyFilterOptions) => void | Promise<void>;
	/**
	 * @description
	 * Use this helper to remove all the filters collection.
	 *
	 * @example
	 * import { useSearchParams } from 'react-router';
	 *
	 * const [searchParams, setSearchParams] = useSearchParams();
	 *
	 * const commit: CommitFunction = (q) => {
	 * 	setSearchParams(new URLSearchParams());
	 * };
	 *
	 * destroyFilters({ commit });
	 */
	destroyFilters: (options?: DestroyFiltersOptions) => void | Promise<void>;
	/**
	 * @description
	 * Use this helper to retrieve the current values of a given filter.
	 *
	 * Defaults to an empty array if no filter is found.
	 *
	 * @example
	 * getFilterValues('bankingAccountIds');
	 *
	 * getFilterValues('date');
	 *
	 * getFilterValues('searchTerm');
	 */
	getFilterValues: <TData>(name: string) => Array<TData>;
};

export type FiltersContextProviderProps = Pick<
	DeserializeFiltersOptions,
	'deserializer' | 'onBeforeDeserializer' | 'onAfterDeserializer' | 'onDeserializerError'
> & {
	/**
	 * @description
	 * The search parameters that should be used to retrieve the filters from.
	 */
	searchParams: URLSearchParams;
	/**
	 * @description
	 * The search parameter name where the filters collection will be stored.
	 *
	 * Defaults to `q` if not present.
	 */
	searchParamName?: string;
	/**
	 * @description
	 * Use this helper function to create a valid search param value given the filters collection.
	 *
	 * Defaults to flatted's `stringify` if not present (See https://www.npmjs.com/package/flatted).
	 */
	serializer?: (filters: Filters) => string;
	/**
	 * @description
	 *
	 * A commit function is the equivalent of doing `transaction.commit()`;
	 *
	 * When passed at the provider's level it will become the default if no `commit` is passed explicitly to any of the exposed helpers.
	 *
	 * @example
	 * import { useSearchParams } from 'react-router';
	 *
	 * const [searchParams, setSearchParams] = useSearchParams();
	 *
	 * const commit: CommitFunction = (q) => {
	 * 	if (!q) {
	 * 		setSearchParams(new URLSearchParams());
	 *
	 * 		return;
	 * 	}
	 *
	 * 	setSearchParams((previousSearchParams) => {
	 * 		previousSearchParams.set('q', q!);
	 *
	 * 		return previousSearchParams;
	 * 	});
	 * };
	 *
	 * <FiltersProvider searchParams={searchParams} commit={commit}>
	 *  <YourComponent/>
	 * </FiltersProvider>
	 */
	commit?: CommitFunction;
};

export const { ContextProvider: FiltersProvider, hook: useFilters } = createContextProvider<
	FiltersContext,
	FiltersContextProviderProps
>({
	name: 'filters',
	useGetState: (options) => {
		const {
			searchParamName = 'q',
			searchParams,
			serializer,
			deserializer,
			onBeforeDeserializer,
			onAfterDeserializer,
			onDeserializerError,
			commit: defaultCommit
		} = options;

		const serializedFilters = searchParams.get(searchParamName);

		const filters = useMemo(() => {
			return deserializeFilters({
				serializedFilters,
				deserializer,
				onBeforeDeserializer,
				onAfterDeserializer,
				onDeserializerError
			});
		}, [serializedFilters]);

		const addFilterValue = (options: AddFilterValueOptions) => {
			const { input, commit = defaultCommit, onBeforeAdd, onAfterAdd, onBeforeCommit, onAfterCommit } = options;

			const updatedFilters = addMultipleFilterValues({ filters, input, onBeforeAdd, onAfterAdd });

			if (!commit) {
				throw new Error(
					'Attempted to add a filter value however no commit function was found. Please set a `commit` helper function or pass it explicitly when invoking `addFilterValue`.'
				);
			}

			return syncState({
				filters: updatedFilters,
				serializer,
				commit,
				onBeforeCommit,
				onAfterCommit
			});
		};

		const removeFilterValue = (options: RemoveFilterValueOptions) => {
			const { input, commit = defaultCommit, onBeforeCommit, onAfterCommit } = options;

			if (!commit) {
				throw new Error(
					'No commit function was found. This can be fixed by passing a `commit` prop in the `FiltersProvider` or the helper being invoked.'
				);
			}

			const updatedFilters = removeMultipleFilterValues({ filters, input });

			return syncState({ filters: updatedFilters, serializer, commit, onBeforeCommit, onAfterCommit });
		};

		const setFilterValue = (options: SetFilterValueOptions) => {
			const { input, commit = defaultCommit, onBeforeCommit, onAfterCommit } = options;

			if (!commit) {
				throw new Error(
					'No commit function was found. This can be fixed by passing a `commit` prop in the `FiltersProvider` or the helper being invoked.'
				);
			}

			const updatedFilters: Filters = setMultipleFilterValues({ filters, input });

			return syncState({ filters: updatedFilters, serializer, commit, onBeforeCommit, onAfterCommit });
		};

		const destroyFilter = (options: DestroyFilterOptions) => {
			const { name, commit = defaultCommit, onBeforeCommit, onAfterCommit } = options;

			if (!commit) {
				throw new Error(
					'No commit function was found. This can be fixed by passing a `commit` prop in the `FiltersProvider` or the helper being invoked.'
				);
			}

			const updatedFilters = removeMultipleFilters({ filters, input: name });

			return syncState({ filters: updatedFilters, serializer, commit, onBeforeCommit, onAfterCommit });
		};

		const destroyFilters = (options?: DestroyFiltersOptions) => {
			const { commit = defaultCommit, onBeforeCommit, onAfterCommit } = options || { commit: defaultCommit };

			if (!commit) {
				throw new Error(
					'No commit function was found. This can be fixed by passing a `commit` prop in the `FiltersProvider` or the helper being invoked.'
				);
			}

			return syncState({ filters: {}, serializer, commit, onBeforeCommit, onAfterCommit });
		};

		const getFilterValues = <TData>(name: string) => {
			return peekFilter<TData>({ filters, name });
		};

		return {
			addFilterValue,
			removeFilterValue,
			setFilterValue,
			destroyFilter,
			destroyFilters,
			getFilterValues
		} as const;
	}
});
