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
            "css/**/*.*", "img/**/*.*", "blog/**/*.*", "blog-*/**/*.*", "meta/**/*.*", 
            "js/libs/addtohomescreen.min.js", "workbox-v3.4.1/**/*.*",
            "tags/**/*.*", "articles/**/*.*", 
            "2x/**/*.*", "ahrefs_5a03081536bf029306bef81b43fc7696b6c06ae3665913d5db668b0d875a3f8d.html",
            "dnrpwa/**/*.*", "fullstackjs/**/*.*", "pwa-back-to-school/**/*.*",
            "js/libs/polyfil/*.*", "font/**/*.*", "sw.js", "images/**/*.*", "blogs/**/*.*"
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