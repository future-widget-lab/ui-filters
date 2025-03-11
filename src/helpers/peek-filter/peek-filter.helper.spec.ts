import { peekFilter } from './peek-filter.helper';
import type { PeekFilterOptions } from './peek-filter.helper';

describe('Unit | Helper | peekFilter', () => {
	it('should exist', () => {
		expect(peekFilter).toBeDefined();
	});

	it('should should return the given name', () => {
		const input: PeekFilterOptions = {
			filters: {
				color: ['red', 'blue', 'green']
			},
			name: 'color'
		};

		const actual = peekFilter(input);

		const expected = ['red', 'blue', 'green'];
		expect(actual).toEqual(expected);
	});

	it('should should return an empty array if not found', () => {
		const input: PeekFilterOptions = {
			filters: {
				color: ['red', 'blue', 'green']
			},
			name: 'unknown'
		};

		const actual = peekFilter(input);

		const expected: Array<any> = [];
		expect(actual).toEqual(expected);
	});
});
