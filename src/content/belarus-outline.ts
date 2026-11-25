/**
 * A simplified outline of Belarus (Natural Earth, 1:110m, public domain).
 * Coordinates are [longitude, latitude]. Used by the observatory star map in
 * the hero and by any future constellation artwork.
 */
export const BELARUS_OUTLINE: ReadonlyArray<readonly [number, number]> = [
	[28.177, 56.169],
	[29.23, 55.918],
	[29.372, 55.67],
	[29.896, 55.789],
	[30.874, 55.551],
	[30.972, 55.082],
	[30.758, 54.812],
	[31.384, 54.157],
	[31.791, 53.975],
	[31.731, 53.794],
	[32.406, 53.618],
	[32.694, 53.351],
	[32.305, 53.133],
	[31.498, 53.167],
	[31.305, 53.074],
	[31.54, 52.742],
	[31.786, 52.102],
	[30.928, 52.042],
	[30.619, 51.823],
	[30.555, 51.32],
	[30.157, 51.416],
	[29.255, 51.368],
	[28.993, 51.602],
	[28.618, 51.428],
	[28.242, 51.572],
	[27.454, 51.592],
	[26.338, 51.832],
	[25.328, 51.911],
	[24.553, 51.888],
	[24.005, 51.617],
	[23.527, 51.578],
	[23.508, 52.024],
	[23.199, 52.487],
	[23.799, 52.691],
	[23.805, 53.09],
	[23.528, 53.47],
	[23.484, 53.912],
	[24.451, 53.906],
	[25.536, 54.282],
	[25.768, 54.847],
	[26.588, 55.167],
	[26.494, 55.615],
	[27.102, 55.783],
	[28.177, 56.169],
];

export const MINSK: readonly [number, number] = [27.559, 53.9];

export const BELARUS_BOUNDS = {
	minLon: 23.199,
	maxLon: 32.694,
	minLat: 51.32,
	maxLat: 56.169,
} as const;

/** Neighbouring countries rendered as small coordinate labels on the map. */
export const NEIGHBOURS = [
	{longitude: 25.3, latitude: 55.4, code: 'LT'},
	{longitude: 25.0, latitude: 56.5, code: 'LV'},
	{longitude: 30.9, latitude: 56.4, code: 'RU'},
	{longitude: 31.2, latitude: 51.6, code: 'UA'},
	{longitude: 22.9, latitude: 52.6, code: 'PL'},
] as const;
