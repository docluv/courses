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

workbox.precaching.precacheAndRoute([
  {
    "url": "about/index.html",
    "revision": "93d118a4ea9ed202f7524d3368aea435"
  },
  {
    "url": "html/layouts/default.html",
    "revision": "5be5894a31fc40040b303ad9aa018059"
  },
  {
    "url": "html/pages/about.html",
    "revision": "ba613313a6c40c80d9b5da521c39aa4a"
  },
  {
    "url": "html/pages/course.html",
    "revision": "8654ff8ef4a61cb9799badb0f5e83c5d"
  },
  {
    "url": "html/pages/courses.html",
    "revision": "8654ff8ef4a61cb9799badb0f5e83c5d"
  },
  {
    "url": "html/pages/index.html",
    "revision": "8654ff8ef4a61cb9799badb0f5e83c5d"
  },
  {
    "url": "html/pages/login.html",
    "revision": "c0cd474b7b3bf87d057465683dae711b"
  },
  {
    "url": "html/pages/profile.html",
    "revision": "8654ff8ef4a61cb9799badb0f5e83c5d"
  },
  {
    "url": "html/pages/register.html",
    "revision": "995619b30abbc0b4ac3765c9b449cf50"
  },
  {
    "url": "html/shell/default.html",
    "revision": "101e2d800069799cd07e4795fb7cd995"
  },
  {
    "url": "html/template/course-list.html",
    "revision": "e1c08797020626efe068069aff89e9a8"
  },
  {
    "url": "html/template/course.html",
    "revision": "b12a6ff5a2eae443c420ee58a919117c"
  },
  {
    "url": "html/template/profile.html",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "img/cavalier-courses-logo-181x80.png",
    "revision": "b8e1d8fcec6f6eb258475fcd3b026466"
  },
  {
    "url": "img/cavalier-courses-logo-48-80.png",
    "revision": "c31ff40881b95dd3fa0489fc9efdd942"
  },
  {
    "url": "img/love2dev-light-logo-612x96.png",
    "revision": "175d088743890650d32029ffee847bb4"
  },
  {
    "url": "img/love2dev-logo-light-dev-trans-1280x214.png",
    "revision": "24c0258e56ddee0027d585608869ef84"
  },
  {
    "url": "img/love2dev-logo-light-dev-trans-320x54.png",
    "revision": "2779e2df0a54218e8ced4c24baeace0d"
  },
  {
    "url": "img/love2dev-logo-light-dev-trans-460x77.png",
    "revision": "b092ffd41f61e50a706ea2eced537e11"
  },
  {
    "url": "img/love2dev-logo-light-dev-trans-717x120.png",
    "revision": "67118be8f1fbd3978fddbea902a8a1bc"
  },
  {
    "url": "img/love2dev-logo-light-dev-trans.html",
    "revision": "43a1a48acd39b62e17c880c358e0ebaa"
  },
  {
    "url": "img/love2dev-logo-light-dev-trans.png",
    "revision": "5d7bb45cf268d10ca8506ba020f30bf3"
  },
  {
    "url": "index.html",
    "revision": "cf1f966d63494d4e46f73996c3d67038"
  },
  {
    "url": "js/boot.js",
    "revision": "20ee91c96bd3e23f38b257b546d31631"
  },
  {
    "url": "js/libs/addtohomescreen.min.js",
    "revision": "b0202aeb189759bf81894a81fbbd4113"
  },
  {
    "url": "js/libs/api.js",
    "revision": "806fa7699d6b3d1787b94cf78bd10e5b"
  },
  {
    "url": "js/libs/localforage.min.js",
    "revision": "b81ba364dcfb998510b178ddeed732f1"
  },
  {
    "url": "js/libs/mustache.min.js",
    "revision": "fbc40afb6aab560e860628150a01f0bd"
  },
  {
    "url": "js/libs/notify.js",
    "revision": "59710b4c77ab6228734dd8b0b0a5e6a4"
  },
  {
    "url": "js/libs/ui/form.submission.js",
    "revision": "5642e0e859d13d4770b2f5107cab759e"
  },
  {
    "url": "js/pages/login.js",
    "revision": "c1b69faa12ccf6a261df796d2888631a"
  },
  {
    "url": "login/index.html",
    "revision": "53ef64f669fe3b2437890bc925a556ca"
  },
  {
    "url": "register/index.html",
    "revision": "28038ed057e531d7cb62ae5b101f0e21"
  }
]);

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
