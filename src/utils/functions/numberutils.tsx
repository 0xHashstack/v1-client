// Deterministic pseudo-random number generator using salt
function simpleHash(str: string): number {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) + hash + str.charCodeAt(i); // hash * 33 + c
	}
	return Math.abs(hash);
}

/**
 * Generates a deterministic pseudo-random integer between min (inclusive) and max (exclusive), given a salt.
 * @param min Minimum value (inclusive)
 * @param max Maximum value (exclusive)
 * @param salt Salt value to ensure deterministic output
 */
export const genNum = (min: number, max: number, salt: string | number) => {
	const hash = simpleHash(String(salt));
	return Math.floor((hash % (max - min)) + min);
};
