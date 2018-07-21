# Contrast Correct
Contrast Correct takes a static background color and a dynamic color and returns a modified version of the dynamic color that has had its contrast increased to be readable on the provided background color according to [WCAG 2.1](https://www.w3.org/TR/WCAG21/#contrast-minimum).

# Installation
```sh
yarn add contrast-correct
```

# Usage
Contrast Correct operates on the following concepts:
* `{r, g, b}` objects that represent each color channel as a number in the range [0, 1].
* Relative luminance values represented as a number in the range [0, 1].
* WCAG 2.1 contrast ratios represented as a number in the range [1, 21].

```javascript
const { correctContrast, relativeLuminance } = require("contrast-correct");

// Our target contrast. 7.0 is recommended for general text.
const CONTRAST = 7;

// Calculate the relative luminance of the background we intend to place this color on.
// The relative luminance is equivalent to the Y in the XYZ color space.
// #000 has the relative luminance of 0.0 and #fff has the relative luminance of 1.0.
const BGY = relativeLuminance({ r: 0x0e / 255, g: 0x0c / 255, b: 0x13 / 255 });

// Get our corrected color object.
const { r, g, b } = correctContrast({ r: 0, g: 0, b: 0x30 }, BGY, CONTRAST);

// Display the result as a nice hex color string. In this case #002fd0.
console.log(
	`#${(((r * 255) << 16) | ((g * 255) << 8) | (b * 255))
		.toString(16)
		.padStart(6, "0")}`
);
```

[Examples with the included hex color helper](./example.js).

# Gotchas
Contrast Correct uses many modern JavaScript features - including object
destructuring. Contrast Correct should be transpiled before serving on the web.

Contrast Correct uses a slightly modified HSL color space in order to create
colors that are reasonably similar to the original color even when extreme
changes are necessary.

Not all contrast ratios are possible on all background colors. A contrast ratio
of `1.0` would mean the colors are identical (though correctContrast never
attempts to lower the contrast ratio if the desired contrast ratio has already
been achieved). A contrast ratio of `21.0` is only possible for a combination
of white and black. The highest contrast ratio that's always possible to
generate a proper result is around `4.58`. If a higher contrast is requested
but not possible Contrast Correct will return the closest possible color (which
by necessity will always be either black or white).

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