import type { Filters } from '../../types/filters.type';
import { addFilterValue } from './add-filter-value.helper';
import type { AddFilterValueOptions } from './add-filter-value.helper';

describe('Unit | Helper | addFilterValue', () => {
	it('should exist', () => {
		expect(addFilterValue).toBeDefined();
	});

	it('should add a string filter value to an existing filter', () => {
		const input: AddFilterValueOptions = {
			filters: { color: ['red', 'blue'], size: [10, 20], isActive: [true] },
			name: 'color',
			value: 'green'
		};

		const actual = addFilterValue(input);

		const expected: Filters = {
			color: ['red', 'blue', 'green'],
			size: [10, 20],
			isActive: [true]
		};
		expect(actual).toEqual(expected);
	});

	it('should add a number filter value to an existing filter', () => {
		const input: AddFilterValueOptions = {
			filters: { color: ['red', 'blue'], size: [10, 20], isActive: [true] },
			name: 'size',
			value: 30
		};

		const actual = addFilterValue(input);

		const expected: Filters = {
			color: ['red', 'blue'],
			size: [10, 20, 30],
			isActive: [true]
		};
		expect(actual).toEqual(expected);
	});

	it('should add a boolean filter value to an existing filter', () => {
		const input: AddFilterValueOptions = {
			filters: { color: ['red', 'blue'], size: [10, 20], isActive: [true] },
			name: 'isActive',
			value: false
		};

		const actual = addFilterValue(input);

		const expected: Filters = {
			color: ['red', 'blue'],
			size: [10, 20],
			isActive: [true, false]
		};
		expect(actual).toEqual(expected);
	});

	it('should add an object filter value to an existing filter', () => {
		const input: AddFilterValueOptions = {
			filters: { color: ['red', 'blue'], size: [10, 20], isActive: [true] },
			name: 'details',
			value: { key: 'value' }
		};

		const actual = addFilterValue(input);

		const expected: Filters = {
			color: ['red', 'blue'],
			size: [10, 20],
			isActive: [true],
			details: [{ key: 'value' }]
		};
		expect(actual).toEqual(expected);
	});

	it('should create a new filter if the filter does not exist', () => {
		const input: AddFilterValueOptions = {
			filters: { color: ['red', 'blue'], size: [10, 20], isActive: [true] },
			name: 'brand',
			value: 'Nike'
		};

		const actual = addFilterValue(input);

		const expected: Filters = {
			color: ['red', 'blue'],
			size: [10, 20],
			isActive: [true],
			brand: ['Nike']
		};
		expect(actual).toEqual(expected);
	});

	it('should handle empty filters', () => {
		const input: AddFilterValueOptions = {
			filters: {},
			name: 'category',
			value: 'Electronics'
		};

		const actual = addFilterValue(input);

		const expected: Filters = {
			category: ['Electronics']
		};
		expect(actual).toEqual(expected);
	});

	it('should call hooks', () => {
		const onBeforeAdd = jest.fn();

		const onAfterAdd = jest.fn();

		const input: AddFilterValueOptions = {
			filters: {},
			name: 'category',
			value: 'Electronics',
			onBeforeAdd,
			onAfterAdd
		};

		const actual = addFilterValue(input);

		const expected: Filters = {
			category: ['Electronics']
		};
		expect(actual).toEqual(expected);
		expect(onBeforeAdd).toHaveBeenCalledTimes(1);
		expect(onBeforeAdd).toHaveBeenCalledWith({ name: 'category', value: 'Electronics' });
		expect(onAfterAdd).toHaveBeenCalledTimes(1);
		expect(onAfterAdd).toHaveBeenCalledWith({ name: 'category', value: 'Electronics' });
	});
});
