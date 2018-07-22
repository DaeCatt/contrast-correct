# Contrast Correct
Contrast Correct allows you to take arbitrary colors and modify them to be
increase their contrast against any background.

Color contrast is determined by the algorithm specified in [WCAG 2.1](https://www.w3.org/TR/WCAG21/#contrast-minimum) and as such processed colors
will be readable even for users with color blindness.

# Usage
```javascript
/**
 * Load Contrast Correct with the provided hex string color helpers. This makes
 * Contrast Correct accept and return hex string colors (such as "#000").
 */
const { correctContrast, relativeLuminance } = require("contrast-correct/hex");

// The color of the background for our text.
const background = "#0e0c13";

// Calculating the corrected color.
let usernameColor = "#003";
let newUsernameColor = correctContrast(
	// Color to correct
	usernameColor,
	// Relative luminance of the text background (can and should be pre-calculated)
	relativeLuminance(background),
	// Target contrast ratio. 7.0 is recommended for text by WCAG 2.1.
	7.0
);

// Log the modified color. In this case "#002fd0".
console.log(newUsernameColor);
```

# Tips
If you already have your own methods for converting hex color strings to
individual channels you can instead load `contrast-correct` and it will instead
accept and return objects in the form
`{ r: 0.0 to 1.0, g: 0.0 to 1.0, b: 0.0 to 1.0 }`.

WCAG 2.1 contrast ratios have a few gotchas. For any background it's always
possible to generate a color with a contrast of around `4.58`, but high
contrast ratious (around 9+) are only possible on very dark or very bright
backgrounds.

# License
**The ISC License (ISC).**

Copyright (C) 2018 Tomas Heie

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.