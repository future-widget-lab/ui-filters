import type { Filters } from '../../types/filters.type';
import { removeMultipleFilterValues } from './remove-multiple-filter-values';
import type { RemoveMultipleFilterValuesOptions } from './remove-multiple-filter-values';

describe('Unit | Helper | removeMultipleFilterValues', () => {
	it('should exist', () => {
		expect(removeMultipleFilterValues).toBeDefined();
	});

	it('should process a single filter input', () => {
		const input: RemoveMultipleFilterValuesOptions = {
			filters: { color: ['red', 'blue', 'green'], size: [10, 20], isActive: [true] },
			input: {
				name: 'color',
				value: ['green']
			}
		};

		const actual = removeMultipleFilterValues(input);

		const expected: Filters = {
			color: ['red', 'blue'],
			size: [10, 20],
			isActive: [true]
		};

		expect(actual).toEqual(expected);
	});

	it('should process multiple filter inputs', () => {
		const input: RemoveMultipleFilterValuesOptions = {
			filters: { color: ['red', 'blue', 'green'], size: [10, 20], isActive: [true] },
			input: [
				{
					name: 'color',
					value: ['red', 'blue', 'green']
				},
				{
					name: 'size',
					value: [10, 20]
				},
				{
					name: 'isActive',
					value: [true]
				}
			]
		};

		const actual = removeMultipleFilterValues(input);

		const expected: Filters = {};
		expect(actual).toEqual(expected);
	});
});
