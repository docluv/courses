
(function (window, undefined) {

    "use strict";

    function getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    return fetch("", {
        "method": "POST",
        "headers": {
            'content-type': 'application/json'
        },
        "mode": "cors",
        "body": JSON.stringify({
            "id": getParameterByName("subscriber")
        })
    }).then(function (response) {

        if (response.ok) {
            // Success!

            if (config.success) {

                callMethod(config.success, response.clone());

            }

        } else {
            // We reached our target server, but it returned an error

            if (config.error) {
                callMethod(config.error, error);
            } else {
                console.error(error);
            }
        }

    })
    .catch(function (error) {

        if (config.error) {
            callMethod(config.error, error);
        } else {
            console.error(error);
        }

    });

}(window));