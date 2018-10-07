/*

Standard popuppromo Item Object Structure:


*/


(function (window, undefined) {

    "use strict";

    var popuppromo = function (customSettings) {

        var self = new popuppromo.fn.init(),
            settings = self.settings =
            $.extend({}, self.settings, customSettings);

            self.setupPromo();

        return self;
    };

    popuppromo.fn = popuppromo.prototype = {

        constructor: popuppromo,

        init: function () {
            return this;
        },

        version: "0.0.2",

        popuppromo: undefined,

        setupPromo: function () {

            //apply delay

            var self = this;

            if (self.checkStatus()) {

                setTimeout(function () {

                    self.showOverlay();

                }, self.settings.delay);

                if (self.settings.formInitialize) {

                    self.settings.formInitialize();

                }

                if (self.settings.close) {

                    var closeBtn = document.querySelector(self.settings.close);

                    if (closeBtn) {

                        closeBtn.addEventListener("click", function () {

                            document.body.classList.remove(self.settings.activeClass);

                        });

                    }

                }

            }

        },

        showOverlay: function () {

            var self = this;

            document.body.classList.add(self.settings.activeClass);

            self.setStatus();

        },

        checkStatus: function () {

            var targetDate;

            if (localStorage) {

                targetDate = localStorage.getItem("popover-lead");

                if (targetDate) {

                    targetDate = new Date(targetDate);

                    return (new Date(Date.now) > targetDate);

                } else {
                    return true;
                }

            }

            return true;

        },

        setStatus: function () {

            if (localStorage) {

                try{

                    localStorage.setItem("popover-lead", (Date.now() + 172800000));

                }catch(exc){
                    console.log("localStorage Exception: ", exc);
                }

            }

        },

        settings: {

            delay: 30000,
            activeClass: "show-overlay-magnet",
            close: ".overlay-magnet-close",
            overlay: ".lead-magnet-overlay",
            visitDelta: (2 * 24 * 60 * 60000)

        }

    };

    // Give the init function the popuppromo prototype for later instantiation
    popuppromo.fn.init.prototype = popuppromo.fn;


    return (window.popuppromo = popuppromo);


}(window));