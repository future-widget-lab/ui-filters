import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router';
import { useFilter, FiltersProvider, useFilters } from '../src/react';
import type { CommitFunction } from '../src/types/filters.type';

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

const App: FC = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const commit: CommitFunction = (q) => {
		if (!q) {
			setSearchParams(new URLSearchParams());

			return;
		}

		setSearchParams((previousSearchParams) => {
			previousSearchParams.set('q', q!);

			return previousSearchParams;
		});
	};

	return (
		<FiltersProvider
			searchParams={searchParams}
			commit={commit}
		>
			<TasksIndexPage />
		</FiltersProvider>
	);
};

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(
	<BrowserRouter>
		<Routes>
			<Route
				path="/"
				element={<App />}
			/>
		</Routes>
	</BrowserRouter>
);
