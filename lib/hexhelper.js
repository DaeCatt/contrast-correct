/**
 * Some helper functions to make it easier to work with hex string colors eg.
 * #0055cc or #abd
 */
"use strict";

/**
 * Convert (hex) number (eg 0x304050) into RGBColor object.
 * @param {number} hex
 */
const hexToRGB = hex => ({
	r: (hex >> 16) / 255,
	g: ((hex >> 8) & 0xff) / 255,
	b: (hex & 0xff) / 255
});

/**
 * Convert RGBColor object to (hex) number.
 * @param {Object} rgb
 */
const rgbToHex = ({ r, g, b }) =>
	(Math.floor(r * 255) << 16) |
	(Math.floor(g * 255) << 8) |
	Math.floor(b * 255);

/**
 * Convert RGBColor object into hex color string.
 * @param {Object} rgb
 */
const rgbToStringHex = rgb =>
	`#${rgbToHex(rgb)
		.toString(16)
		.padStart(6, "0")}`;

/**
 * Convert hex color string (eg. #304050) into (hex) number (eg. 0x304050).
 * @param {string} string
 */
const stringHexToHex = string => {
	switch (string.length) {
		// #123456
		case 7:
		// #12345678 (alpha is ignored)
		case 9: {
			const r = parseInt(string.slice(1, 3), 16);
			const g = parseInt(string.slice(3, 5), 16);
			const b = parseInt(string.slice(5, 7), 16);
			return (r << 16) | (g << 8) | b;
		}

		// #123
		case 3:
		// #1234 (alpha is ignored)
		case 4: {
			const r = parseInt(string.slice(1, 2), 16);
			const g = parseInt(string.slice(2, 3), 16);
			const b = parseInt(string.slice(3, 4), 16);
			return (r << 20) | (r << 16) | (g << 12) | (g << 8) | (b << 4) | b;
		}
	}

	throw new Error("String is not valid hex color string.");
};

/**
 * Convert hex color string to RGBColor object.
 * @param {string} string
 */
const stringHexToRGB = string => hexToRGB(stringHexToHex(string));

module.exports = {
	hexToRGB,
	rgbToHex,
	rgbToStringHex,
	stringHexToHex,
	stringHexToRGB
};
