import { setFilterValue } from './set-filter-value.helper';

describe('Unit | Helper | setFilterValue', () => {
	it('should exist', () => {
		expect(setFilterValue).toBeDefined();
	});

	it.each([
		{
			input: {
				filters: {},
				name: 'color',
				value: ['red', 'blue']
			},
			expected: {
				color: ['red', 'blue']
			}
		},
		{
			input: {
				filters: {
					color: ['blue']
				},
				name: 'color',
				value: ['red', 'blue']
			},
			expected: {
				color: ['red', 'blue']
			}
		},
		{
			input: {
				filters: {
					color: ['red', 'blue']
				},
				name: 'color',
				value: ['red', 'blue']
			},
			expected: {
				color: ['red', 'blue']
			}
		},
		{
			input: {
				filters: {
					color: ['red', 'blue']
				},
				name: 'color',
				value: ['red', 'blue', 'green']
			},
			expected: {
				color: ['red', 'blue', 'green']
			}
		},
		{
			input: {
				filters: {
					color: ['red', 'blue']
				},
				name: 'color',
				value: null
			},
			expected: {}
		},
		{
			input: {
				filters: {
					color: ['red', 'blue'],
					size: [10, 20]
				},
				name: 'color',
				value: null
			},
			expected: {
				size: [10, 20]
			}
		}
	])('should return $expected given $input', ({ input, expected }) => {
		const actual = setFilterValue(input as any);

		expect(actual).toEqual(expected);
	});
});
