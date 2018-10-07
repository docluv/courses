var coursesAPI = (function () {

    var api = "http://localhost:15601/",
        authToken = "auth-token";

    function saveAuthToken(token) {

        return localforage.setItem(authToken, token)
            .then(function () {

                return token;

            });

    }

    function fetchApiJSON(entity) {

        return fetch(api + entity)
            .then(function (response) {

                if (response.ok) {

                    return response.json();

                } else {

                    throw entity + " fetch failed";
                }

            });

    }

    function postApiJSON(entity, body) {

        return fetch(api + entity, {
                "method": "POST",
                "cache": 'no-cache',
                "headers": {
                    'content-type': 'application/json'
                },
                "mode": "cors",
                "body": typeof body === "object" ? JSON.stringify(body) : body
            })
            .then(function (response) {

                if (response.ok) {

                    return response.json();

                } else {

                    throw entity + " fetch failed";
                }

            });

    }

    function putApiJSON(entity, body) {

        return fetch(api + entity, {
                "method": "PUT",
                "cache": 'no-cache',
                "headers": {
                    'content-type': 'application/json'
                },
                "mode": "cors",
                "body": typeof body === "object" ? JSON.stringify(body) : body
            })
            .then(function (response) {

                if (response.ok) {

                    return response.json();

                } else {

                    throw entity + " fetch failed";
                }

            });

    }


    return {

        apiGet: function (entity, authorize) {

            var self = this;

            authorize = authorize || true;

            if (authorize) {

                return self.verifyToken()
                then(function () {

                    return fetchApiJSON(entity);

                });
            }

        },

        apiPOST: function (entity, body, authorize) {

            var self = this;

            authorize = authorize || true;

            if (authorize) {

                return self.verifyToken()
                then(function () {

                    return postApiJSON(entity, body);

                });
            }

        },

        apiPOST: function (entity, body, authorize) {

            var self = this;

            authorize = authorize || true;

            if (authorize) {

                return self.verifyToken()
                then(function () {

                    return putApiJSON(entity, body);

                });
            }

        },

        loadTemplate: function (url) {

            return fetch(url)
                .then(function (response) {

                    if (response.ok) {

                        return response.text()
                            .then(function (template) {

                                return template;

                            });

                    }

                    return;

                })

        },

        getCourses: function () {

            return this.apiGet("courses", true);

        },

        getUserCourses: function (userId) {

            return this.apiGet("courses/user/" + userId, true);

        },

        getUserProfile: function (id) {

            return this.apiGet("users/" + id);

        },

        getCourse: function (id) {

            return this.apiGet("courses/" + id, true);

        },

        register: function (user) {

            return apiPOST("users/", user, true);

        },

        updateUser: function (user) {

            return apiPUT("users/", user, true);

        },

        verifyToken: function () {

            return localforage.getItem(authToken)
                .then(function (token) {

                    if (token) {

                        pwaTicketAPI.token = token;

                        return token;

                    } else {

                        window.location.href = "login";
                    }

                });

        },

        login: function (credentials) {

            return this.apiGet("users/?userName=" +
                    credentials.username +
                    "&password=" + credentials.password, false)
                .then(function (token) {

                    if (token.length > 0) {

                        return saveAuthToken(token[0]);

                    }

                });

        },

        logout: function () {

            localforage.removeItem(authToken)
                .then(function () {

                    window.location.href = "login";

                });

        }

    };

})();