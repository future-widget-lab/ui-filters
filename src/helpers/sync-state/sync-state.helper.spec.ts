import { syncState } from './sync-state.helper';
import type { SyncStateOptions } from './sync-state.helper';

describe('Unit | Helper | syncState', () => {
	it('should exist', () => {
		expect(syncState).toBeDefined();
	});

	it('should sync', () => {
		const filters = {
			color: ['pink', 'violet']
		};

		const commit = jest.fn().mockImplementation((q) => {
			expect(q).toEqual(JSON.stringify(filters));
		});

		const serializer = jest.fn().mockImplementation((f) => {
			expect(f).toEqual(filters);

			return JSON.stringify(f);
		});

		const input: SyncStateOptions = {
			filters,
			commit,
			serializer
		};

		syncState(input);
	});

	it('should pass undefined to the commit helper if filters collection is empty', () => {
		const filters = {};

		const commit = jest.fn().mockImplementation((q) => {
			expect(q).toBeUndefined();
		});

		const input: SyncStateOptions = {
			filters,
			commit
		};

		syncState(input);
	});

	it('should call hooks', () => {
		const filters = {
			color: ['pink', 'violet']
		};

		const onBeforeCommit = jest.fn();

		const onAfterCommit = jest.fn();

		const commit = jest.fn().mockImplementation((q) => {
			expect(q).toEqual(JSON.stringify(filters));
		});

		const serializer = jest.fn().mockImplementation((f) => {
			expect(f).toEqual(filters);

			return JSON.stringify(f);
		});

		const input: SyncStateOptions = {
			filters,
			commit,
			serializer,
			onBeforeCommit,
			onAfterCommit
		};

		syncState(input);

		expect(onBeforeCommit).toHaveBeenCalledTimes(1);
		expect(onBeforeCommit).toHaveBeenCalledWith();
		expect(onAfterCommit).toHaveBeenCalledTimes(1);
		expect(onAfterCommit).toHaveBeenCalledWith();
	});
});
