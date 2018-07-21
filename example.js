"use strict";

const { correctContrast, relativeLuminance } = require("./index");
const { stringHexToRGB, rgbToStringHex } = require("./lib/hexhelper");

/**
 * Get the relative luminance of the background color we intend to render our
 * corrected colors on.
 */
const BG_LUMINANCE = relativeLuminance(stringHexToRGB("#0e0c13"));

/**
 * The resulting contrast we desire. WCAG 2.1 defines a minimum contrast of 4.5
 * for text and images of text or 3.0 for large text.
 *
 * Recommended contrast is 7.0 for text and images of text and at least 4.5 for
 * large text.
 */
const CONTRAST = 7;

/**
 * Takes a hex string color (eg. #003) and performs contrast correction on it
 * for our given background luminance and desired contrast then returns the
 * corrected color as a hex string color (eg. #9494de).
 * @param {string} hex
 */
const correctHex = hex =>
	rgbToStringHex(correctContrast(stringHexToRGB(hex), BG_LUMINANCE, CONTRAST));

console.log(correctHex("#000"));
console.log(correctHex("#003"));
console.log(correctHex("#030"));
console.log(correctHex("#300"));
