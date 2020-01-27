//"use strict"; //https://love2dev.com/blog/javascript-strict-mode/

(function () {

    var _d = {
        qs: function (s) {
            return document.querySelector(s);
        },
        qsa: function (s) {
            return document.querySelectorAll(s);
        },
        gei: function (s) {
            return document.getElementById(s);
        },
        gen: function (s) {
            return document.getElementsByName(s);
        }
    };

    window._d = _d;

    var deferredPrompt;

    window.addEventListener('beforeinstallprompt', function (e) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;

        showAddToHomeScreen();

    });

    function showAddToHomeScreen() {

        var a2hsBtn = _d.qs(".ad2hs-prompt");

        a2hsBtn.style.display = "flex";

        a2hsBtn.addEventListener("click", addToHomeScreen);

    }

    function addToHomeScreen() {

        var a2hsBtn = _d.qs(".ad2hs-prompt");

        // hide our user interface that shows our A2HS button
        a2hsBtn.style.display = 'none';

        if (deferredPrompt) {
            // Show the prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice
                .then(function (choiceResult) {

                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }

                    deferredPrompt = null;

                });

        }

    }

    window.addEventListener('appinstalled', function (evt) {
        console.log('a2hs', 'installed');
    });

    function initializeApp() {

        if (window.location.href.indexOf("login") === -1) {

            coursesAPI.verifyToken()
                .then(function (token) {

                    if (token) {

                        document.body.classList.add("authenticated");

                    } else {

                        window.location.href = "login";
                    }

                });

        }

    }

    initializeApp();


    if ('serviceWorker' in navigator) {

        navigator.serviceWorker.register('/sw.js').then(function (registration) { // Registration was successful

            if (registration.active) {

                send_message_to_sw("precache-update");

            }

            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) { // registration failed :(

            console.log('ServiceWorker registration failed: ', err);
        });

        function send_message_to_sw(msg) {

            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage(msg);
            }
        }

        navigator.serviceWorker.onmessage = function (evt) {

            var message = JSON.parse(evt.data),
                isRefresh = message.type === 'refresh',
                isAsset = message.url.includes('asset'),
                lastETag = localStorage.currentETag,
                isNew = lastETag !== message.eTag;

            if (isRefresh && isAsset && isNew) {

                if (lastETag) {

                    notice.hidden = false;

                }

                //this needs to be idb
                localStorage.currentETag = message.eTag;

            }

        };

    }

})();