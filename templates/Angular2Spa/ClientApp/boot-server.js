"use strict";
require('angular2-universal-preview/dist/server/universal-polyfill.js');
var ngCore = require('angular2/core');
var ngRouter = require('angular2/router');
var ngUniversal = require('angular2-universal-preview');
var node_http_1 = require('angular2-universal-preview/dist/server/src/http/node_http');
var ngUniversalRender = require('angular2-universal-preview/dist/server/src/render');
var app_1 = require('./components/app/app');
function default_1(params) {
    var serverBindings = [
        ngRouter.ROUTER_BINDINGS,
        ngUniversal.HTTP_PROVIDERS,
        ngUniversal.SERVER_LOCATION_PROVIDERS,
        ngCore.provide(ngRouter.APP_BASE_HREF, { useValue: '/' }),
        ngCore.provide(node_http_1.BASE_URL, { useValue: params.absoluteUrl }),
        ngCore.provide(ngUniversal.REQUEST_URL, { useValue: params.url })
    ];
    return ngUniversalRender.renderToString(app_1.App, serverBindings).then(function (html) {
        return { html: html };
    });
}
exports.default = default_1;
//# sourceMappingURL=boot-server.js.map