# imagemagick-convert

Node.js wrapper for [ImageMagick CLI](http://www.imagemagick.org) for simple converting images.

## Prerequisites

* Node.js >= 7.10.1
* ImageMagick >= 6.9.5

## Installation

With NPM:
```shell script
npm install --save imagemagick-convert
```

With Yarn:
```shell script
yarn add imagemagick-convert
```

ImageMagick installation (see [more details](http://www.imagemagick.org/www/script/download.php)):

|OS|Command|
|---|---|
|OS X|`brew install imagemagick`|
|Ubuntu/Debian|`apt-get install imagemagick`|
|Centos/RHEL|`yum install ImageMagick`|
|Alpine|`apk add --update imagemagick`|

## Example

```javascript
import {readFileSync} from 'fs';
import {convert} from 'imagemagick-convert';

// somewhere in async function
const imgBuffer = await convert({
    srcData: readFileSync('./origin.jpg'),
    srcFormat: 'JPEG',
    width: 100,
    height: 100,
    resize: 'crop',
    format: 'PNG'
});
```

Original JPEG:

![Original image](./docs/origin.jpg)

Converted to PNG and resized:

|fit|fill|crop|
|---|---|---|
|![Original image](./docs/fit.jpg)|![Original image](./docs/fill.jpg)|![Original image](./docs/crop.jpg)|

## API reference

`convert(options: Object):Promise<Buffer>` - converts images

Options:

| Attribute | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `srcData` | `Buffer` | * | | source image |
| `srcFormat` | `Dictionary` | | auto-detection | source file format (explicit specification), for more details see [ImageMagick Supported Image Formats](http://www.imagemagick.org/script/formats.php) |
| `width` | `Integer` | | source width | output image width in pixels | 
| `height` | `Integer` | | source height | output image height in pixels  |
| `resize` | `Enum` | | `crop` | style of resizing: `crop`, `fit`, `fill`|
| `density` | `Integer` | | `600` | density/resolution for rendering an image from vector formats such as `Postscript`, `PDF`, `WMF`, `SVG` |
| `background` | `String` | | `none` | background color or transparency for images |
| `gravity` | `Dictionary` | | `Center` | gravity option, for more details see [ImageMagick gravity options](http://www.imagemagick.org/script/command-line-options.php#gravity) |
| `format` | `Dictionary` | | source format | output file format, for more details see [ImageMagick Supported Image Formats](http://www.imagemagick.org/script/formats.php) |
| `quality` | `Integer` | | `75` | JPEG/MIFF/PNG compression level: `1` - `100` |
| `blur` | `Float` | | `0` | blur level: `0` - `1` |
| `rotate` | `Integer` | | `0` | rotating degrees |
| `flip` | `Boolean` | | `false` | vertical flip |
