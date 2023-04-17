const {spawn} = require('child_process');

const RESIZE_DEFAULT = 'crop',
    optionsDefaults = {
        srcData: null,
        srcFormat: null,
        width: null,
        height: null,
        resize: RESIZE_DEFAULT,
        density: 600,
        background: 'none',
        gravity: 'Center',
        format: null,
        quality: 75,
        blur: null,
        rotate: null,
        flip: false
    },
    attributesMap = new Set([
        'density',
        'background',
        'gravity',
        'quality',
        'blur',
        'rotate',
        'flip'
    ]);

class Converter {
    /**
     * Converter instance
     * @param {Object} options
     */
    constructor(options = {}) {
        this.options = new Map(Object.entries({
            ...optionsDefaults,
            ...options
        }));
    }

    /**
     * Proceed converting
     * @returns {Promise<Buffer>}
     */
    proceed() {
        return new Promise((resolve, reject) => {
            const source = this.options.get('srcData');

            if (source && (source instanceof Buffer)) {
                try {
                    const origin = this.createOccurrence(this.options.get('srcFormat')),
                        result = this.createOccurrence(this.options.get('format')),
                        cmd = this.composeCommand(origin, result),
                        cp = spawn('convert', cmd),
                        store = [];

                    cp.stdout.on('data', (data) => store.push(Buffer.from(data)));
                    cp.stdout.on('end', () => resolve(Buffer.concat(store)));

                    cp.stderr.on('data', (data) => reject(data.toString()));
                    cp.stdin.end(source);
                }
                catch (e) {
                    reject(e);
                }
            }
            else reject(new Error('imagemagick-convert: the field `srcData` is required and should have `Buffer` type'));
        });
    }

    /**
     * Create occurrence
     * @param {string|null} format
     * @param {string|null} name
     * @returns {string}
     */
    createOccurrence(format = null, name = null) {
        const occurrence = [];

        if (format) occurrence.push(format);
        occurrence.push(name || '-');

        return occurrence.join(':');
    }

    /**
     * Compose command line
     * @param {string} origin
     * @param {string} result
     * @returns {string[]}
     */
    composeCommand(origin, result) {
        const cmd = [],
            resize = this.resizeFactory();

        // add attributes
        for (const attribute of attributesMap) {
            const value = this.options.get(attribute);

            if (value || value === 0) {
                cmd.push(`-${attribute}`);
                if (typeof value !== 'boolean') {
                    cmd.push(`${value}`);
                }
            }
        }

        // add resizing preset
        if (resize) cmd.push(resize);

        // add in and out
        cmd.push(origin);
        cmd.push(result);

        return cmd;
    }

    /**
     * Resize factory
     * @returns {string}
     */
    resizeFactory() {
        const resize = this.options.get('resize'),
            geometry = this.geometryFactory(),

            resizeMap = new Map([
                ['fit', `-resize ${geometry}`],
                ['fill', `-resize ${geometry}!`],
                ['crop', `-resize ${geometry}^ -crop ${geometry}+0+0!`]
            ]);

        if (!resize || !geometry) return '';

        return resizeMap.get(resize) || resizeMap.get(RESIZE_DEFAULT);
    }

    /**
     * Geometry factory
     * @returns {string}
     */
    geometryFactory() {
        const size = [],
            w = this.options.get('width'),
            h = this.options.get('height');

        size.push(w || w === 0 ? w : '');
        if (h || h === 0) size.push(h);

        return size.join('x');
    }
}

/**
 * Convert function
 * @param {Object} options
 * @returns {Promise<Buffer>}
 */
const convert = async (options) => {
    const converter = new Converter(options);

    return converter.proceed();
};

module.exports = {
    Converter,
    convert
};
