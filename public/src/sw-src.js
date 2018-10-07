'use strict';

self.importScripts("js/libs/localforage.min.js",
    "js/libs/mustache.min.js",
    "js/app/api.js",
    "workbox-v3.6.2/workbox-sw.js"
);

workbox.setConfig({
    debug: false,
    modulePathPrefix: "workbox-v3.6.2/"
});

workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.suppressWarnings();

workbox.precaching.precacheAndRoute([]);

workbox.routing.setDefaultHandler(workbox.strategies.cacheFirst());


