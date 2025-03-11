# @future-widget-lab/ui-filters

A set of primitives for handling filters through search parameters in React applications. Provides a standardized API to manage, read, and update filters without enforcing a specific routing solution.

## Features

- Standardized serialization and deserialization of filters, ensuring a consistent API for handling filters in search parameters.
- Type-safe filter operations, leveraging TypeScript for safer and more predictable interactions.
- React hooks for filter state management, providing an easy way to read, update, and sync filters.
- Supports multiple filter types, allowing flexibility in handling different kinds of filter values.
- Router-agnostic, making it compatible with React Router, Next.js, and other solutions.

## Philosophy

Search parameters and filters are essential tools for refining data, but they serve different roles in how users interact with datasets.

Search parameters are a way to represent state in a URL. They allow users to modify what they see on a page without needing to refresh or lose context. Whether it's navigating through a paginated list or applying sorting rules, search parameters help maintain state across interactions and shareable links.

However, Search parameters, by themselves, are just raw data—they lack structure and meaning beyond their immediate use. Without a clear strategy, they can become inconsistent, redundant, or difficult to manage.

Filters are an abstraction that organize search parameters into a structured system. Instead of treating each parameter as an isolated value, filters define how parameters work together to refine a dataset. Filtering is about narrowing down information based on user-selected criteria, while search is about retrieving relevant results from a broader dataset.

A well-implemented filtering system ensures:

- Consistency: Users interact with filters in predictable ways across different contexts.
- State Management: Filters act as a single source of truth, making it easier to persist, reset, and modify states.
- User Experience: Users can intuitively apply multiple filters without confusion or unexpected behavior.

This structured approach ensures that filtering is more accurate than a simple search, as it systematically limits the dataset to what users explicitly need.

Rather than scattering individual filters across multiple search parameters, we advocate centralizing them into a single search parameter. This approach provides:

- Better Scalability: Adding new filters doesn’t require increasing the number of URL parameters.
- Simplified Parsing and Serialization: A single structured object makes it easier to read and modify filter states.
- Clearer Intent: Users and developers can more easily understand what is being filtered without dealing with fragmented search logic.

### Comparison of Filtering Approaches

| Approach                                              | Pros                                                                                                                                           | Cons                                                                                                                             | Best Use Cases                                                                                |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Structured Filtering (Single Search Parameter)        | ✅ Easier to parse and manage as a single object <br> ✅ Scales well with complex filtering needs <br> ✅ Keeps URLs cleaner and more readable | ❌ Harder to manually edit filters in the URL <br> ❌ Requires custom serialization and deserialization logic.                   | When filters need to be persisted as structured state, shared, or modified programmatically.  |
| Hybrid Approach (Some Filters as Separate Parameters) | ✅ Allows users to manually tweak filters in the URL <br> ✅ Can be useful for integrating with existing APIs that expect individual params    | ❌ Can lead to inconsistent handling of filters <br> ❌ More search parameters to manage <br> ❌ Harder to scale as filters grow | When URL readability and manual editing are key priorities (e.g., public-facing search tools) |

With this in mind, we include pagination within filters because it follows the same principle of structuring search parameters into a single, scalable system. By treating pagination as part of the filtering process, we maintain consistency in state management and avoid search fragmentation—while always considering alternative approaches based on specific use cases.

For further insights on the distinction between search and filtering, check out this article by [Michelle Mac](https://heymichellemac.com/difference-between-search-and-filter).

## Installation

```sh
npm install @future-widget-lab/ui-filters
```

## Setup

Since filters rely on search parameters, we need them to the `FiltersProvider`. This also requires a `commit` function, which defines how updates are applied. Wrap your application as follows:

```typescript
import type { FC } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { FiltersProvider, type CommitFunction } from '@future-widget-lab/ui-filters/react';

const App: FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const commit: CommitFunction = (q) => {
		if (!q) {
			setSearchParams(new URLSearchParams());
			return;
		}

		setSearchParams((previousSearchParams) => {
			previousSearchParams.set('q', q);
			return previousSearchParams;
		});
	};

	return (
		<FiltersProvider
			searchParams={searchParams}
			commit={commit}
		>
			{/* Your components */}
		</FiltersProvider>
	);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<Routes>
			<Route
				path="/"
				element={<App />}
			/>
		</Routes>
	</BrowserRouter>
);
```

## Usage

Here's how you can implement simple pagination with filters:

```typescript
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useFilter, useFilters } from '@future-widget-lab/ui-filters/react';

// Note: The filtering logic is intentionally repeated in `TasksList` and `TasksPagination` to demonstrate how filters keep state consistent across multiple components.

const ITEMS = Array.from({ length: 50 }, (_, i) => ({
	id: i + 1,
	name: `Task ${i + 1}`
}));

const PAGE_SIZE = 10;

const TasksSearchSection: FC = () => {
	const [input, setInput] = useState('');

	const { setFilterValue, destroyFilters } = useFilters();

	const searchTerm = useFilter<string>('search')[0] ?? '';

	const handleSearch = (event: React.FormEvent) => {
		event.preventDefault();

		setFilterValue({
			input: [
				{
					name: 'page',
					value: 1
				},
				{
					name: 'search',
					value: input
				}
			]
		});
	};

	const handleClearPressed = () => {
		destroyFilters();
	};

	const handleSearchChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInput(event.target.value);
	};

	useEffect(() => {
		setInput(searchTerm);
	}, [searchTerm]);

	return (
		<header>
			<form style={{ display: 'flex', flexDirection: 'row', gap: '0.5em' }}>
				<input
					value={input}
					onChange={handleSearchChanged}
					placeholder="Search..."
				/>
				<button
					type="submit"
					onClick={handleSearch}
				>
					Search
				</button>
				<button
					type="button"
					onClick={handleClearPressed}
				>
					Clear
				</button>
			</form>
		</header>
	);
};

const TasksList: FC = () => {
	const searchTerm = useFilter<string>('search')[0] ?? '';
	const page = useFilter<number>('page')[0] || 1;

	const filteredTasks = ITEMS.filter((item) => {
		return item.name.toLowerCase().includes(searchTerm.toLowerCase());
	});

	const paginatedItems = filteredTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return (
		<ul>
			{paginatedItems.map((item, index) => (
				<li key={index}>{item.name}</li>
			))}
		</ul>
	);
};

const TasksPagination: FC = () => {
	const { setFilterValue } = useFilters();

	const searchTerm = useFilter<string>('search')[0] ?? '';
	const page = useFilter<number>('page')[0] || 1;

	const filteredTasks = ITEMS.filter((item) => {
		return item.name.toLowerCase().includes(searchTerm.toLowerCase());
	});

	const totalPages = Math.ceil(filteredTasks.length / PAGE_SIZE);

	const handlePreviousPressed = () => {
		setFilterValue({
			input: {
				name: 'page',
				value: page - 1
			}
		});
	};

	const handleNextPressed = () => {
		setFilterValue({
			input: {
				name: 'page',
				value: page + 1
			}
		});
	};

	return (
		<footer style={{ display: 'flex', flexDirection: 'row', gap: '0.5em' }}>
			<button
				disabled={page <= 1}
				onClick={handlePreviousPressed}
			>
				Prev
			</button>
			{totalPages > 0 ? (
				<span>
					{page} / {totalPages}
				</span>
			) : (
				<span>No Results</span>
			)}
			<button
				disabled={page >= totalPages}
				onClick={handleNextPressed}
			>
				Next
			</button>
		</footer>
	);
};

const TasksIndexPage: FC = () => {
	return (
		<section>
			<TasksSearchSection />
			<TasksList />
			<TasksPagination />
		</section>
	);
};
```

## API Reference

### Providers

#### `FiltersProvider`

##### Description

The react context provider responsible for managing the filters state.

##### Options

| Name                                | Type                           | Description                                                                                                                                                                                                   |
| ----------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `searchParams`                      | `URLSearchParams`              | The search parameters instance that should be used to retrieve the filters from.                                                                                                                              |
| `searchParamName` _(optional)_      | `string`                       | The search parameter name where the filters collection will be stored. Defaults to `q` if not present.                                                                                                        |
| `serializer` _(optional)_           | `(filters: Filters) => string` | Helper function used to create a valid search param value given the filters collection. Defaults to `flatted`'s `stringify`. (See [flatted](https://www.npmjs.com/package/flatted))                           |
| `deserializer` _(optional)_         | `(value: string) => Filters`   | Helper function used to create a valid filters collection out of the search parameter value where filters are stored. Defaults to `flatted`'s `parse`. (See [flatted](https://www.npmjs.com/package/flatted)) |
| `onBeforeDeserializer` _(optional)_ | `VoidFunction`                 | A hook that fires before the filters collection is deserialized. Consumers can use this to perform side-effects.                                                                                              |
| `onAfterDeserializer` _(optional)_  | `(filters: Filters) => void`   | A hook that fires after the filters collection is deserialized. Consumers can use this to perform side-effects.                                                                                               |
| `onDeserializerError` _(optional)_  | `(error: Error) => void`       | A hook that fires when an error occurs during deserialization. Consumers can use this to handle errors or perform side-effects.                                                                               |
| `commit` _(optional)_               | `CommitFunction`               | Helper function used to apply the changes, similar to a `transaction.commit()` method. If passed at the provider level (Recommended approach), it becomes the default if no explicit `commit` is provided.    |

### Hooks

#### `useFilters() => FiltersContext`

##### Description

Returns the filters context.

#### `useFilter<TData>(name: string) => Array<TData>`

##### Description

Retrieves the current values of a given filter.

##### Options

| Name   | Type     | Description                       |
| ------ | -------- | --------------------------------- |
| `name` | `string` | The name of the filter to lookup. |

### Context

### Helpers (`FiltersContext`)

#### `addFilterValue: (options: AddFilterValueOptions) => void | Promise<void>`

##### Description

Adds a new filter value for the specified filter name while ensuring no duplicates are added.

Comparison checks are performed as follows:

- Object values are serialized into strings for accurate comparison.
- Primitives values (strings, numbers, etc.) are compared directly without serialization.

##### Options

| Name                          | Type                                  | Description                                                                                                |
| ----------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `input`                       | `FilterInput` \| `Array<FilterInput>` | The new filter value(s) to add.                                                                            |
| `onBeforeAdd` _(optional)_    | `(input: FilterInput) => void`        | A hook that fires before the value is added. Consumers can use this to perform validation or side-effects. |
| `onAfterAdd` _(optional)_     | `(input: FilterInput) => void`        | A hook that fires after the value is added. Consumers can use this to perform side-effects.                |
| `onBeforeCommit` _(optional)_ | `VoidFunction`                        | A hook that fires before committing changes.                                                               |
| `onAfterCommit` _(optional)_  | `VoidFunction`                        | A hook that fires after committing changes.                                                                |

#### `removeFilterValue: (options: RemoveFilterValueOptions) => void | Promise<void>`

##### Description

Removes one or more filter values from the specified filter name.

Comparison checks are performed as follows:

- Object values are serialized into strings for accurate comparison.
- Primitives values (strings, numbers, etc.) are compared directly without serialization.

##### Options

| Name                          | Type                                | Description                                                                            |
| ----------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| `input`                       | `FilterInput \| Array<FilterInput>` | The filter value(s) to remove.                                                         |
| `commit` _(optional)_         | `CommitFunction`                    | Optional function to sync state syncing the URL with the current state of the filters. |
| `onBeforeCommit` _(optional)_ | `VoidFunction`                      | A hook that fires before committing changes.                                           |
| `onAfterCommit` _(optional)_  | `VoidFunction`                      | A hook that fires after committing changes.                                            |

#### `setFilterValue: (options: SetFilterValueOptions) => Promise<void>`

##### Description

Sets (Adds or removes) the value(s) of a given filter.

- If `value` is `null`, `undefined`, or an empty array, the filter is removed.
- If `value` is a single item, it replaces the existing filter values.
- If `value` is an array, all existing filter values are cleared before adding the new ones.

This ensures that each filter is updated in a structured way:

1. Existing filter values are first removed using `removeFilterValue`.
2. New filter values are then added using `addFilterValue`.
3. If no values remain, `removeFilter` is used to delete the filter entirely.

Comparison checks are performed as follows:

- Object values are serialized into strings for accurate comparison.
- Primitives values (strings, numbers, etc.) are compared directly without serialization.

##### Options

| Name                          | Type                                      | Description                                                                            |
| ----------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `input`                       | `AnyFilterInput \| Array<AnyFilterInput>` | The filter value(s) to set.                                                            |
| `commit` _(optional)_         | `CommitFunction`                          | Optional function to sync state syncing the URL with the current state of the filters. |
| `onBeforeCommit` _(optional)_ | `VoidFunction`                            | A hook that fires before committing changes.                                           |
| `onAfterCommit` _(optional)_  | `VoidFunction`                            | A hook that fires after committing changes.                                            |

#### `destroyFilter: (options: DestroyFilterOptions) => void | Promise<void>`

##### Description

Removes a filter and its associated values from the filters collection.

##### Options

| Name                          | Type             | Description                                                                            |
| ----------------------------- | ---------------- | -------------------------------------------------------------------------------------- |
| `name`                        | `string`         | The name of the filter that will be removed.                                           |
| `commit` _(optional)_         | `CommitFunction` | Optional function to sync state syncing the URL with the current state of the filters. |
| `onBeforeCommit` _(optional)_ | `VoidFunction`   | A hook that fires before committing changes.                                           |
| `onAfterCommit` _(optional)_  | `VoidFunction`   | A hook that fires after committing changes.                                            |

#### `destroyFilters: (options?: DestroyFiltersOptions) => void | Promise<void>`

##### Description

Removes all the filters collection.

##### Options

| Name                          | Type             | Description                                                                            |
| ----------------------------- | ---------------- | -------------------------------------------------------------------------------------- |
| `commit` _(optional)_         | `CommitFunction` | Optional function to sync state syncing the URL with the current state of the filters. |
| `onBeforeCommit` _(optional)_ | `VoidFunction`   | A hook that fires before committing changes.                                           |
| `onAfterCommit` _(optional)_  | `VoidFunction`   | A hook that fires after committing changes.                                            |

#### `getFilterValues: <TData>(name: string) => Array<TData>`

##### Description

Retrieves the current values of a given filter.

##### Options

| Name   | Type     | Description                      |
| ------ | -------- | -------------------------------- |
| `name` | `string` | The name of the filter to lookup |

## License

MIT
