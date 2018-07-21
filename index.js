"use strict";

/**
 * Maximum steps to take in binary search for optimal color.
 */
const MAX_STEPS = 9;

/**
 * @typedef {Object} RGBColor
 * @property {number} r [0, 1]
 * @property {number} g [0, 1]
 * @property {number} b [0, 1]
 */

/**
 * @typedef {Object} HSLColor
 * @property {number} h [0, 1]
 * @property {number} s [0, 1]
 * @property {number} l [0, 1]
 */

/**
 * Converts an sRGB color value to a linear color value.
 * @param {number} srgb color channel value [0, 1]
 * @returns {number} [0, 1]
 */
const gammaToLinear = srgb =>
	srgb === 0 || srgb === 1
		? srgb
		: srgb < 0.04045
			? srgb / 12.92
			: Math.pow((srgb + 0.055) / 1.055, 2.4);

const WHITE_R = 0.2126;
const WHITE_B = 0.0722;
const WHITE_G = 1 - WHITE_R - WHITE_B;

/**
 * Calculates the relative luminance of an RGBColor object.
 * This is equivalent to the Y in the XYZ color space.
 * @param {RGBColor} rgb
 * @returns {number}
 */
const relativeLuminance = ({ r, g, b }) =>
	WHITE_R * gammaToLinear(r) +
	WHITE_G * gammaToLinear(g) +
	WHITE_B * gammaToLinear(b);

/**
 * Determines the contrast between two relative luminance values according to
 * WCAG 2.1.
 * @param {number} Y1 [0, 1]
 * @param {number} Y2 [0, 1]
 */
const calculateContrast = (Y1, Y2) =>
	(Math.max(Y1, Y2) + 0.05) / (Math.min(Y1, Y2) + 0.05);

/**
 * Helper function for `hslToRGB`
 * @param {number} p
 * @param {number} q
 * @param {number} t
 */
const hueToRGB = (p, q, t) => {
	while (t < 0) t++;
	while (t > 1) t--;

	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
};

/**
 * Converts HSLColor object to RGBColor object.
 * @param {HSLColor} hsl
 * @returns {RGBColor}
 */
const hslToRGB = ({ h, s, l }) => {
	if (s === 0) return { r: l, g: l, b: l };

	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;

	const r = hueToRGB(p, q, h + 1 / 3);
	const g = hueToRGB(p, q, h);
	const b = hueToRGB(p, q, h - 1 / 3);
	return { r, g, b };
};

/**
 * Converts RGBColor object to HSLColor object.
 * @param {RGBColor} rgb
 * @returns {HSLColor}
 */
const rgbToHSL = ({ r, g, b }) => {
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);

	const l = (max + min) / 2;
	if (max === min) return { h: 0, s: 0, l };

	const d = max - min;
	const s = l > 0.5 ? d / (2 - d) : d / (max + min);

	let h = 0;
	switch (max) {
		case r:
			h = (g - b) / d + (g < b ? 6 : 0);
			break;
		case g:
			h = (b - r) / d + 2;
			break;
		case b:
			h = (r - g) / d + 4;
			break;
	}

	h /= 6;
	return { h, s, l };
};

/**
 *
 * @param {RGBColor} rgb
 * @param {number} backgroundLuminance
 * @param {number} desiredContrast
 */
const correctContrast = (rgb, backgroundLuminance, desiredContrast) => {
	let Y = relativeLuminance(rgb);
	if (calculateContrast(Y, backgroundLuminance) >= desiredContrast) return rgb;

	let { h, s, l } = rgbToHSL(rgb);

	/**
	 * This hack exists to deal with a quirk in the hsl color space where very
	 * dark colors are considered to have extremely high saturation.
	 */

	s *= Math.pow(l > 0.5 ? -l : l - 1, 7) + 1;

	/**
	 * Calculate our target luminance in order to achieve the desired contrast
	 * on the background luminance.
	 */
	if (backgroundLuminance >= 0.5) {
		Y = (backgroundLuminance + 0.05) / desiredContrast - 0.05;
	} else {
		Y = desiredContrast * (backgroundLuminance + 0.05) - 0.05;
	}

	/**
	 * Perform the binary search.
	 */
	let currentY = 0;
	let i = 0;
	let d = 0.5;
	l = 0.5;

	for (; i < MAX_STEPS; ++i) {
		currentY = relativeLuminance(hslToRGB({ h, s, l }));
		if (Math.abs(Y - currentY) < Number.EPSILON) break;

		l = currentY > Y ? l - d : l + d;
		d /= 2;
	}

	return hslToRGB({ h, s, l });
};

module.exports = {
	calculateContrast,
	correctContrast,
	relativeLuminance
};
