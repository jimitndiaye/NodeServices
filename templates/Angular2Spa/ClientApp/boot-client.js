"use strict";
require('angular2/bundles/angular2-polyfills.js');
require('bootstrap');
require('./styles/site.css');
var common_1 = require('angular2/common');
var router_1 = require('angular2/router');
var http_1 = require('angular2/http');
var app_1 = require('./components/app/app');
// browser bootstrap
// import { bootstrap } from 'angular2/platform/browser';
//bootstrap(App, [ROUTER_BINDINGS, HTTP_PROVIDERS, FormBuilder]); 
// worker imports
var core_1 = require('angular2/core');
var worker_app_1 = require('angular2/platform/worker_app');
// worker bootstrap
core_1.platform(worker_app_1.WORKER_APP_PLATFORM).asyncApplication(function () { return Promise.resolve([
    worker_app_1.WORKER_APP_APPLICATION,
    worker_app_1.WORKER_APP_ROUTER,
    core_1.provide(router_1.APP_BASE_HREF, { useValue: '/' }),
]); })
    .then(function (appRef) {
    return appRef.bootstrap(app_1.App, [router_1.ROUTER_BINDINGS, http_1.HTTP_PROVIDERS, common_1.FormBuilder]);
})
    .then(function (compRef) {
    var injector = compRef.injector;
    var router = injector.get(router_1.Router);
    return router._currentNavigation;
})
    .then(function () {
    setTimeout(function () {
        postMessage('APP_READY', undefined);
    });
});
if (module.hot) {
    module.hot.accept();
}
//# sourceMappingURL=boot-client.js.map