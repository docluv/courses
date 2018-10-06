'use strict';

var fs = require("fs"),
    path = require("path"),
    _ = require("lodash"),
    stripBom = require("strip-bom"),
    template = require("mustache"),
    crypto = require("crypto"),
    utf8 = 'utf-8';

module.exports = {

    utf8: utf8,

    getHash: function (data) {

        let md5 = crypto.createHash('md5');

        md5.update(data);

        return md5.digest('hex');
    },


    unixifyPath: function (filepath) {
        if (isWindows) {
            return filepath.replace(/\\/g, '/');
        } else {
            return filepath;
        }
    },

    MakeDirectory: function (target) {

        if (!fs.existsSync(target)) {
            fs.mkdirSync(target);
        }

    },

    copyFileSync: function (srcFile, destFile, override) {

        override = override || this.project.overwrite;

        if (!fs.existsSync(target) || override) {

            this.createFile(destFile, fs.readFileSync(srcFile, utf8), override);

        }
    },

    capitalizeFirstLetter: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    makeSlug: function (src) {

        if (typeof src === "string") {

            return src.replace(/ +/g, "-")
                .replace(/\'/g, "")
                .replace(/[^\w-]+/g, "")
                .replace(/-+/g, "-")
                .toLowerCase();

        }

        return "";

    },

    createFile: function (target, body, override) {

        override = override || false;

        if (!fs.existsSync(target) || override) {

            if (!fs.existsSync(path.dirname(target))) {

                fs.mkdirSync(path.dirname(target));

            }

            fs.writeFileSync(target, body, utf8);
        }

    },

    generateFile: function (src, dest, data, override) {

        override = override || false;

        if (!fs.existsSync(dest) || override) {

            var content = fs.readFileSync(src, utf8);

            this.createFile(dest, template.render(content, data), override);

        }

    },

    parse: function (value) {

        if (!value) {
            return {};
        }

        if (typeof value === "string") {

            value = JSON.parse(value);

        }

        return value;

    },

    readFile: function (src) {

        if (fs.existsSync(src)) {

            return stripBom(fs.readFileSync(src, utf8));

        }else{
            return undefined;
        }

    },

    readJSON: function (src) {

        let content = this.readFile(src);

        if(content){

            return this.parse(content);

        }

    },

    ensureFilePath: function (target) {

        var folder = path.dirname(target),
            folders = folder.toLowerCase().replace(/c:\\/g, "").split("\\"),
            targetFolder = "c:\\";

        for (var i = 0; i < folders.length; i++) {

            if (targetFolder === "c:\\") {

                targetFolder += folders[i];

            } else {

                targetFolder += "\\" + folders[i];

            }

            if (!fs.existsSync(targetFolder)) {

                fs.mkdirSync(targetFolder);

            }

        }

    },

    titleCase: function (str) {

        if (str) {

            return str.replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );

        } else {

            return "";

        }
    }

};