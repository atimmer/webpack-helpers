const { join } = require( 'path' );

/**
 * Test whether a given value is an array.
 *
 * @param {*} val A value to test for array-ness.
 * @returns {Boolean} Whether the provided argument is an array.
 */
const isArr = val => Array.isArray( val );

/**
 * Test whether a given value is an object.
 *
 * @param {*} val A value to test for object-ness.
 * @returns {Boolean} Whether the provided argument is an object.
 */
const isObj = val => ( typeof val === 'object' );

/**
 * Given two objects, merge array and object properties, then allow scalar
 * properties from the second object to override those from the first.
 *
 * Note: This implementation is more simplistic than the merge utilities
 * in libraries like lodash, but sufficient to this package's purpose.
 *
 * @param {Object} obj1 An object.
 * @param {Object} obj2 A second object to merge with the first.
 * @returns {Object} A deeply merged object.
 */
const deepMerge = ( obj1, obj2 ) => {
	return Object.keys( obj2 ).reduce( ( merged, key ) => {
		if ( ! obj1[ key ] ) {
		}
		// If the properties on both objects are arrays, merge the arrays.
		if ( isArr( obj1[ key ] ) && isArr( obj2[ key ] ) ) {
			return {
				...merged,
				[ key ]: [ ...obj1, ...obj2 ],
			};
		}

		// If the properties on both objects are objects, merge recursively.
		if ( isObj( obj1[ key ] ) && isObj( obj2[ key ] ) ) {
			return {
				...merged,
				[ key ]: deepMerge( obj1[ key ], obj2[ key ] ),
			};
		}

		// Default / fall-through behavior: the value from obj2 wins.
		return {
			...merged,
			[ key ]: obj2[ key ],
		};
	}, {
		// Start the reducer with a shallow clone of obj1.
		...obj1,
	} );
};

/**
 * Given an object, return a function to generate new objects based on that
 * template. The factory method accepts an object which will be merged with
 * the template to generate a final output object.
 *
 * @param {Object} options A template object of default values.
 * @returns {Function} A function accepting an object of property overrides
 * and returning a final, merged object.
 */
const withOverrides = options => ( overrides = {} ) => deepMerge( options, overrides );

/**
 * Return the absolute path for a working directory-relative  file system path.
 *
 * @param  {...String} relPaths One or more strings describing a path relative
 *                              to the working directory.
 * @returns {String} An absolute file system path.
 */
const filePath = ( ...relPaths ) => join( process.cwd(), ...relPaths );

module.exports = {
	withOverrides,
	filePath,
};