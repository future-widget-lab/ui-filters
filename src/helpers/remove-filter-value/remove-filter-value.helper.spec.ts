import type { Filters } from '../../types/filters.type';
import type { RemoveFilterValueOptions } from './remove-filter-value.helper';
import { removeFilterValue } from './remove-filter-value.helper';

describe('Unit | Helper | removeFilterValue', () => {
	it('should exist', () => {
		expect(removeFilterValue).toBeDefined();
	});

	it('should remove a string filter value from an existing filter', () => {
		const input: RemoveFilterValueOptions = {
			filters: { color: ['red', 'blue', 'green'], size: [10, 20], isActive: [true] },
			name: 'color',
			value: 'green'
		};

		const actual = removeFilterValue(input);

		const expected: Filters = {
			color: ['red', 'blue'],
			size: [10, 20],
			isActive: [true]
		};

		expect(actual).toEqual(expected);
	});

	it('should remove a number filter value from an existing filter', () => {
		const input: RemoveFilterValueOptions = {
			filters: { color: ['red', 'blue'], size: [10, 20, 30], isActive: [true] },
			name: 'size',
			value: 30
		};

		const actual = removeFilterValue(input);

		const expected: Filters = {
			color: ['red', 'blue'],
			size: [10, 20],
			isActive: [true]
		};

		expect(actual).toEqual(expected);
	});

	it('should remove a boolean filter value from an existing filter', () => {
		const input: RemoveFilterValueOptions = {
			filters: { color: ['red', 'blue'], size: [10, 20], isActive: [true, false] },
			name: 'isActive',
			value: false
		};

		const actual = removeFilterValue(input);

		const expected: Filters = {
			color: ['red', 'blue'],
			size: [10, 20],
			isActive: [true]
		};

		expect(actual).toEqual(expected);
	});

	it('should remove an object filter value from an existing filter', () => {
		const input: RemoveFilterValueOptions = {
			filters: { color: ['red', 'blue'], size: [10, 20], details: [{ key: 'value' }] },
			name: 'details',
			value: { key: 'value' }
		};

		const actual = removeFilterValue(input);

		const expected: Filters = {
			color: ['red', 'blue'],
			size: [10, 20]
		};

		expect(actual).toEqual(expected);
	});

	it('should handle removing a filter that does not exist', () => {
		const input: RemoveFilterValueOptions = {
			filters: { color: ['red', 'blue'], size: [10, 20], isActive: [true] },
			name: 'brand',
			value: 'Nike'
		};

		const actual = removeFilterValue(input);

		const expected: Filters = {
			color: ['red', 'blue'],
			size: [10, 20],
			isActive: [true]
		};

		expect(actual).toEqual(expected);
	});

	it('should handle empty filters', () => {
		const input: RemoveFilterValueOptions = {
			filters: {},
			name: 'category',
			value: 'Electronics'
		};

		const actual = removeFilterValue(input);

		const expected: Filters = {};

		expect(actual).toEqual(expected);
	});

	it('should remove a string filter value from an existing filter and remove the entire filter if it has only one value', () => {
		const input: RemoveFilterValueOptions = {
			filters: { color: ['green'], size: [10, 20], isActive: [true] },
			name: 'color',
			value: 'green'
		};

		const actual = removeFilterValue(input);

		const expected: Filters = {
			size: [10, 20],
			isActive: [true]
		};

		expect(actual).toEqual(expected);
	});
});
