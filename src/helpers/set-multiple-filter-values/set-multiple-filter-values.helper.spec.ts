import type { Filters } from '../../types/filters.type';
import { setMultipleFilterValues } from './set-multiple-filter-values';
import type { SetMultipleFilterValuesOptions } from './set-multiple-filter-values';

describe('Unit | Helper | setMultipleFilterValues', () => {
	it('should exist', () => {
		expect(setMultipleFilterValues).toBeDefined();
	});

	it('should process a single filter input', () => {
		const input: SetMultipleFilterValuesOptions = {
			filters: {
				color: ['pink', 'violet']
			},
			input: {
				name: 'color',
				value: ['red', 'blue', 'green']
			}
		};

		const actual = setMultipleFilterValues(input);

		const expected: Filters = {
			color: ['red', 'blue', 'green']
		};
		expect(actual).toEqual(expected);
	});

	it('should process multiple filter inputs', () => {
		const input: SetMultipleFilterValuesOptions = {
			filters: {
				color: ['pink', 'violet'],
				size: [30]
			},
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

		const actual = setMultipleFilterValues(input);

		const expected: Filters = {
			color: ['red', 'blue', 'green'],
			size: [10, 20],
			isActive: [true]
		};
		expect(actual).toEqual(expected);
	});
});
