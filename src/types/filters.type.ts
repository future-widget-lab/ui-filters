/**
 * @description
 * Use this type to represent a valid filter value, which can be:
 * - A `string`, `number`, or `boolean` for primitive filters.
 * - An `object` for more complex filtering scenarios.
 *
 * Object values are typically serialized for comparison to ensure uniqueness.
 */
export type FilterValue = string | number | boolean | object;

/**
 * @description
 * Use this type to represent a collection of filters, where each filter name maps to an array of values.
 *
 * - The key (`string`) is the filter name.
 * - The value (`Array<FilterValue>`) contains all selected values for that filter.
 *
 * This structure allows multiple values to be associated with a single filter, supporting flexible filtering logic.
 */
export type Filters = Record<string, Array<FilterValue>>;

/**
 * @description
 * Use this type to describe the value a consumer has passed.
 */
export type FilterInput = {
	/**
	 * @description
	 * The name of the filter to remove the value from.
	 */
	name: string;
	/**
	 * @description
	 * The value to remove from the filter. Can be a single value or an array of values.
	 */
	value: FilterValue | Array<FilterValue>;
};

/**
 * @description
 * A looser definition for an input. Allows nulls to mark the intent to remove the value and/or filter.
 */
export type AnyFilterInput = {
	/**
	 * @description
	 * The name of the filter to remove the value from.
	 */
	name: string;
	/**
	 * @description
	 * The value to remove from the filter. Can be a single value or an array of values.
	 */
	value: FilterValue | Array<FilterValue> | null | undefined;
};

/**
 * @description
 * A commit function is the equivalent of doing `transaction.commit()`;
 */
export type CommitFunction = (q: string | undefined) => any;

/**
 * @description
 * Use this type to represent the transactional nature of commiting the changes for the filters.
 */
export type Commitable<TOptions> = TOptions & {
	/**
	 * @description
	 * The helper in responsible for syncing the URL with the current state of the filters.
	 *
	 * This helper works as a `.commit` method of a transaction.
	 *
	 * The recommended approach is leveraging a default `commit` provided at the `FiltersProvider` and using this one for one-off situations where you need the entire control over how search parameters should be updated.
	 */
	commit?: CommitFunction;
	/**
	 * A hook that is fired before the filters collection is commited.
	 *
	 * Consumers can use this to perform any kind of side-effects.
	 */
	onBeforeCommit?: VoidFunction;
	/**
	 * A hook that is fired after the filters collection is commited.
	 *
	 * Consumers can use this to perform any kind of side-effects.
	 */
	onAfterCommit?: VoidFunction;
};
