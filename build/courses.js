const utils = require("./utils"),
    path = require("path"),
    template = require("mustache");

let courses = utils.readJSON("../public/www/data/courses.json");

let _template = utils.readFile("../public/src/html/template/course-list.html");

console.log(courses.length);

let courselist = template.render(_template, {courses: courses});

utils.createFile(path.resolve("../public/src/html/pages/courses.html"), courselist, true);


//let html = shell.replace(/<%Layout%>/g, layout);

//html = html.replace(/{{{body}}}/, courselist);

