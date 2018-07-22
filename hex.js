/**
 * Provides the core functionality wrapped in hex color string helpers.
 */

"use strict";

const { correctContrast, relativeLuminance } = require("./index");
const { stringHexToRGB, rgbToStringHex } = require("./lib/hexhelper");

/**
 *
 * @param {string} hex string color
 * @param {number} backgroundLuminance
 * @param {number} desiredContrast
 * @returns {string} hex string color
 */
const correctContrastHex = (hex, backgroundLuminance, desiredContrast) =>
	rgbToStringHex(
		correctContrast(stringHexToRGB(hex), backgroundLuminance, desiredContrast)
	);

/**
 *
 * @param {string} hex
 * @returns {number} relative luminance
 */
const relativeLuminanceHex = hex => relativeLuminance(stringHexToRGB(hex));

module.exports = {
	correctContrast: correctContrastHex,
	relativeLuminance: relativeLuminanceHex
};
