import { stringify } from 'flatted';
import type { Commitable, CommitFunction, Filters } from '../../types/filters.type';

export type SyncStateOptions = Commitable<{
	/**
	 * @description
	 * The filters collection.
	 */
	filters: Filters;
	/**
	 * @description
	 * The helper in responsible for syncing the URL with the current state of the filters.
	 */
	commit: CommitFunction;
	/**
	 * @description
	 * A helper function in charge of receiving the filters and creating an url-friendly string.
	 *
	 * Defaults to flatted's `stringify` if not present (See https://www.npmjs.com/package/flatted).
	 */
	serializer?: (filters: Filters) => string;
}>;

/**
 * @description
 * Use this helper to notify the current filters collection state with the consumers.
 *
 * - If filters exist, they are serialized and committed.
 * - If no filters exist, the commit function is given an `undefined` value for the filters.
 */
export const syncState = async (options: SyncStateOptions) => {
	const { filters, commit, serializer = stringify, onBeforeCommit, onAfterCommit } = options;

	onBeforeCommit?.();

	const q = Object.keys(filters).length === 0 ? undefined : serializer(filters);

	commit(q);

	onAfterCommit?.();
};
