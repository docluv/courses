(function (window, undefined) {

    "use strict";

    var options = {
        targetURL: "",
        form: ".your-form-selector",
        submit: ".btn-submit"
    };

    function callMethod(name, param) {

        var objects = name.split("."),
            rootObj = window;

        for (var index = 0; index < objects.length; index++) {

            var element = objects[index];

            if(index < objects.length -1){

                rootObj = rootObj[element];

            }else{

                rootObj[element](param);

            }

        }

    }

    function setupForm(form) {

        var config = Object.assign({}, options);

        config.form = form;
        config.targetURL = form.getAttribute("l2d-form-action");
        config.submit = form.getAttribute("l2d-form-submit");
        config.success = form.getAttribute("l2d-form-sucess");
        config.error = form.getAttribute("l2d-form-error");

        if (config.submit) {

            config.submitBtn = form.querySelector(config.submit);

        }

        if (config.submitBtn) {

            config.submitBtn.addEventListener("click", function (e) {

                e.preventDefault();
                e.stopPropagation();

                submitForm(config);

                return false;

            });

        }

    }

    function setupformSubmission() {

        var forms = document.querySelectorAll(".l2d-form");

        for (var index = 0; index < forms.length; index++) {

            setupForm(forms[index]);

        }

    }

    function serialize(form) {

        var i, j, q = {};

        if (!form || form.nodeName !== "FORM") {
            return;
        }

        for (i = 0; i < form.elements.length; i++) {

            var ele = form.elements[i].name;

            if (ele.name === "") {
                continue;
            }

            switch (ele.nodeName) {
                case 'INPUT':
                    switch (ele.type) {
                        case 'text':
                        case 'hidden':
                        case 'password':
                        case 'button':
                        case 'reset':
                        case 'submit':
                        case 'tel':
                        case 'email':
                        case 'date':
                        case 'datetime':
                        case 'range':
                        case 'number':
                        case 'url':
                        case 'search':
                            q[ele.name] = ele.value;
                            break;
                        case 'checkbox':
                        case 'radio':
                            if (ele.checked) {
                                q[ele.name] = ele.value;
                            }
                            break;
                    }
                    break;
                case 'file':
                    break;
                case 'TEXTAREA':
                    q[ele.name] = ele.value;
                    break;
                case 'SELECT':
                    switch (ele.type) {
                        case 'select-one':
                            q[ele.name] = ele.value;
                            break;
                        case 'select-multiple':
                            for (j = ele.options.length - 1; j >= 0; j = j - 1) {
                                if (ele.options[j].selected) {
                                    q[ele.name] = encodeURIComponent(ele.options[j].value);
                                }
                            }
                            break;
                    }
                    break;
                case 'BUTTON':
                    switch (ele.type) {
                        case 'reset':
                        case 'submit':
                        case 'button':
                            q[ele.name] = ele.value;
                            break;
                    }
                    break;
            }
        }

        return q;

    }

    function isValid(form) {

        return form.checkValidity();

    }

    function submitForm(config) {

        if (isValid(config.form)) {

            return fetch(config.targetURL, {
                    "method": "POST",
                    "headers": {
                        'content-type': 'application/json'
                    },
                    "mode": "cors",
                    "body": JSON.stringify(serialize(config.form))
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

        }

    }

    setupformSubmission();

}(window));