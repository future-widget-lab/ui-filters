import { removeFilter } from './remove-filter.helper';

describe('Unit | Helper | removeFilter', () => {
	it('should exist', () => {
		expect(removeFilter).toBeDefined();
	});

	it.each([
		{
			input: {
				filters: { color: ['red', 'blue'], size: [10, 20, 30], isActive: [true] },
				name: 'size'
			},
			expected: {
				color: ['red', 'blue'],
				isActive: [true]
			}
		},
		{
			input: {
				filters: { color: ['red', 'blue'], size: [10, 20, 30], isActive: [true] },
				name: 'random'
			},
			expected: { color: ['red', 'blue'], size: [10, 20, 30], isActive: [true] }
		}
	])('should return $expected given $input', ({ input, expected }) => {
		const actual = removeFilter(input);

		expect(actual).toEqual(expected);
	});
});
