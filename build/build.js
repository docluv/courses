/*

this file takes the logic from the makeHTML and makeDeferred modules to create the site
this will be enhanced by adding logic to create the stand along HTML pages in addition to the SPA views


*/

const utils = require("./utils"),
    fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    template = require("mustache"),
    stripBom = require("strip-bom"),
    _ = require("lodash"),
    utf8 = 'utf-8';

let project = {},
    appShell = "",
    layouts = {};

function parseAppConfig(config) {

    return new Promise(function (resolve, reject) {

        if (!fs.existsSync(config)) {
            console.error("config.json file missing");
            return;
        }

        var appConfig = stripBom(fs.readFileSync(config, utf8));

        project.config = utils.parse(appConfig);

        project.config.webrootPath = path.resolve("../public/www");

        let scripts = "\"";

        for (let index = 0; index < project.config.scripts.length; index++) {

            const script = project.config.scripts[index];

            scripts += script + "\"";

            if (index < project.config.scripts.length - 1) {

                scripts += ", ";
                scripts += "\"";

            }

        }

        project.config.scripts = scripts;

        utils.MakeDirectory(project.config.webrootPath);

        project.config.srcPath = path.resolve("../public/src");

        resolve();

    });

};

function loadAppShell() {

    appShell = fs.readFileSync(path.resolve(project.config.srcPath, "html/shell/default.html"), utf8);

}

function loadLayouts() {

    fs.readdir(path.resolve(project.config.srcPath, "html/layouts"), (err, files) => {

        files.forEach(file => {

            let name = path.basename(file, ".html");

            layouts[name] = utils.readFile(path.resolve(project.config.srcPath, "html/layouts", file));

        });

    });

}

function loadPageHTML(slug) {

    if (slug === "/") {
        slug = "index";
    }

    return utils.readFile(path.join("../public/src/html/pages", slug + ".html"));

}

const buildPage = (file) => {

    let page = utils.readJSON(path.resolve(file), utf8),
        body = loadPageHTML(page.slug);

    //load HTML from HTML source
    //took this out to assume the page has already had the body set before this step
    //body = loadPageHTML(page.slug);

    if (body && body !== "") {
        page.body = body.replace(/\r\n/g, "")
            .replace(/\n\r/g, "")
            .replace(/\s{2,}/g, " ");
    }

    page = Object.assign({}, project.config, page);

    return page;

}

function buildContent() {

    let rootPath = __dirname.replace("build", "public/www");

    glob("../config/pages/**/*.json", function (er, files) {

        for (let i = 0; i < files.length; i++) {

            let page = buildPage(files[i]);

            if (page.active) {

                console.log("making: ", path.join(rootPath, page.slug, "index.html"));

                let pageHTML = appShell.replace(/<%Layout%>/, layouts[page.layout]);

                pageHTML = template.render(pageHTML, page);

                utils.createFile(path.join(rootPath, page.slug, "index.html"),
                    pageHTML, true);

            }

        }

    });

}

parseAppConfig(path.resolve("../config/site.json"))
    .then(loadAppShell)
    .then(loadLayouts)
    .then(buildContent)
    .then(function () {

        console.log("done");

    })
    .catch(function (error) {

        console.error("bummer");
        console.error(error);

    });