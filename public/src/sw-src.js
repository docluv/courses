'use strict';

/*
    This application assumes some simplified constraints

    - single shell
    - single layout
    - course/{id}
    - student/{id}
    - authentication token persistend in IDB
    - use auth token to redirect to login if missing *
    - or respond with not authorized page (students) *
    
    * todo items :)
*/

self.importScripts("js/libs/localforage.min.js",
    "js/libs/mustache.min.js",
    "js/libs/api.js",
    "workbox-v3.6.2/workbox-sw.js"
);

workbox.setConfig({
    debug: false,
    modulePathPrefix: "workbox-v3.6.2/"
});

workbox.precaching.precacheAndRoute([]);

workbox.routing.setDefaultHandler(workbox.strategies.cacheFirst());


//returns last folder in the path, which correlates to an id
//a very simple solution for a limited dataset
//a real application may have a more complex route structure to parse
const getSlug = url => {

    let slug = url.split("\/"),
        index = slug.length - 1;

    if (slug[index] === "") {

        index--;

    }

    return slug[index];

}

const fetchText = url => {

    return fetch(url)
        .then(response => {

            if (response.ok) {

                return response.text();
            }

        });

}

const fetchJSON = url => {

    return fetch(url)
        .then(response => {

            if (response.ok) {

                return response.json();
            }

        });

}

//we only have a single shell and a single layout
//so this is over simplified
//a real application typically has multiple shell and layout combinations,
//which would make this more complex :)
const fetchShellLayout = () => {

    let shell = "";

    return fetchText("html/shell/default.html")
        .then(_shell => {

            shell = _shell;

            return fetchText("html/layouts/default.html");

        })
        .then(layout => {

            return shell.replace(/<%Layout%>/g, layout);

        });

}

const fetchCourse = ({
    url,
    event,
    params
}) => {

    let slug = getSlug(url);

    return fetchShellLayout()
        .then(shell => {

            let template, course;

            fetchText("html/template/course.html")
                .then(_template => {

                    template = _template;

                    return fetchJSON("data/courses/" + slug + "json");
                })
                .then(_course => {

                    course = _course;

                    if (template && course) {

                        template = Mustache.render(template, course);

                        let html = shell.replace("<%template%>", template);

                        // Response will be “A guide on Workbox”
                        let response = new Response(
                            html, {
                                headers: {
                                    'content-type': 'text/html'
                                }
                            }
                        );

                        //cache the clone because you can only 
                        //use a response.body once in its life
                        caches.open("courses")
                            .then(cache => {
                                cache.put(event.request, response.clone());
                            });

                        return response;

                    } else {

                        //return error response
                        return new Response("599 Rendering Exception");
                    }

                });

        });

};

const fetchStudent = ({
    url,
    event,
    params
}) => {
    // Response will be “A guide on Workbox”
    return new Response(
        `A ${params.type} on ${params.name}`
    );
};

const handler = ({url, event, params}) => {
    // Response will be “A guide on Workbox”
   return new Response(
     `A ${params.type} on ${params.name}`
   );
 };

 const matchFunction = ({url, event}) => {
    // Return true if the route should match
    return /foo\//.test(url);
  };

  workbox.routing.registerRoute(matchFunction, handler);

  workbox.routing.registerRoute(
    /students/,
    workbox.strategies.cacheFirst({
        cacheName: 'students',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 40,
                maxAgeSeconds: 60 * 5, // 5 minutes
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            })
        ]
    })
);

workbox.routing.registerRoute(
    /courses/,
    workbox.strategies.cacheFirst({
        cacheName: 'courses',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 40,
                maxAgeSeconds: 60 * 5, // 5 minutes
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            })
        ]
    })
);


workbox.routing.registerRoute(
    new RegExp('/course/(.*)'),
    fetchCourse
);


workbox.routing.registerRoute(
    /student\/*/,
    fetchStudent
);


workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.suppressWarnings();
