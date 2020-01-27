const workboxBuild = require('workbox-build');



// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
    // This will return a Promise
    return workboxBuild.injectManifest({
        "globDirectory": "../public/www",
        "globPatterns": [
            "**/*.{html,ico,jpg,png,JPG,jpeg,js}"
        ],
        "globIgnores": [
            "css/**/*.*", "img/people/**/*.*", "course/**/*.*", "courses/**/*.*", "profile/**/*.*", 
            "workbox-v3.6.2/**/*.*", "js/libs/polyfil/*.*", "sw.js", "meta/**/*.*"
        ],
        "swSrc": '../public/src/sw-src.js',
        "swDest": "../public/www/sw.js"
    }).then(({
        count,
        size,
        warnings
    }) => {
        // Optionally, log any warnings and details.
        warnings.forEach(console.warn);
        console.log(`${count} files will be precached, totaling ${size} bytes.`);
    });
}

buildSW();