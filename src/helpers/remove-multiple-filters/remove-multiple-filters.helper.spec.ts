import { removeMultipleFilters } from './remove-multiple-filters.helper';

describe('Unit | Helper | removeMultipleFilters', () => {
	it('should exist', () => {
		expect(removeMultipleFilters).toBeDefined();
	});

	it.each([
		{
			input: {
				filters: { color: ['red', 'blue'], size: [10, 20, 30], isActive: [true] },
				input: ['size', 'isActive']
			},
			expected: {
				color: ['red', 'blue']
			}
		},
		{
			input: {
				filters: { color: ['red', 'blue'], size: [10, 20, 30], isActive: [true] },
				input: ['size', 'isActive', 'color']
			},
			expected: {}
		},
		{
			input: {
				filters: { color: ['red', 'blue'], size: [10, 20, 30], isActive: [true] },
				input: 'color'
			},
			expected: { size: [10, 20, 30], isActive: [true] }
		}
	])('should return $expected given $input', ({ input, expected }) => {
		const actual = removeMultipleFilters(input);

		expect(actual).toEqual(expected);
	});
});
