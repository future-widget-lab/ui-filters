import type { Filters } from '../../types/filters.type';
import { addMultipleFilterValues } from './add-multiple-filter-values.helper';
import type { AddMultipleFilterValuesOptions } from './add-multiple-filter-values.helper';

describe('Unit | Helper | addMultipleFilterValues', () => {
	it('should exist', () => {
		expect(addMultipleFilterValues).toBeDefined();
	});

	it('should process a single filter input', () => {
		const input: AddMultipleFilterValuesOptions = {
			filters: {},
			input: {
				name: 'color',
				value: ['red', 'blue', 'green']
			}
		};

		const actual = addMultipleFilterValues(input);

		const expected: Filters = {
			color: ['red', 'blue', 'green']
		};
		expect(actual).toEqual(expected);
	});

	it('should process multiple filter inputs', () => {
		const input: AddMultipleFilterValuesOptions = {
			filters: {},
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

		const actual = addMultipleFilterValues(input);

		const expected: Filters = {
			color: ['red', 'blue', 'green'],
			size: [10, 20],
			isActive: [true]
		};
		expect(actual).toEqual(expected);
	});
});
