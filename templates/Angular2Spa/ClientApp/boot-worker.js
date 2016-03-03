"use strict";
require('angular2/bundles/angular2-polyfills.js');
var core_1 = require('angular2/core');
var worker_render_1 = require('angular2/platform/worker_render');
var VENDOR_BUNDLE = "/dist/vendor.js";
var CLIENT_BUNDLE = "/dist/main.js";
var workerScriptUrl = URL.createObjectURL(new Blob([("\n  var importScripts_ = this.importScripts;\n  \n  this.importScripts = function importScripts() {\n    for (var i = 0, scripts = new Array(arguments.length); i < scripts.length; ++i) {       \n      var script = arguments[i];\n      \n      if (script.indexOf('http:') !== 0 || script.indexOf('https:') !== 0) {\n        script = '" + window.location.origin + "' + (script[0] === '/' ? script : '/' + script);\n      }\n      \n      scripts[i] = script;\n    }\n    \n    return importScripts_.apply(this, scripts);\n  };\n\n  importScripts('" + VENDOR_BUNDLE + "', '" + CLIENT_BUNDLE + "');\n")], {
    type: 'text/javascript'
}));
var appRef = core_1.platform(worker_render_1.WORKER_RENDER_PLATFORM).application([
    worker_render_1.WORKER_RENDER_APP,
    worker_render_1.WORKER_RENDER_ROUTER,
    core_1.provide(worker_render_1.WORKER_SCRIPT, { useValue: workerScriptUrl })
]);
var worker = appRef.injector.get(worker_render_1.WebWorkerInstance).worker;
worker.addEventListener('message', function onAppReady(event) {
    if (event.data === 'APP_READY') {
        worker.removeEventListener('message', onAppReady, false);
        URL.revokeObjectURL(workerScriptUrl);
        setTimeout(function () { return document.dispatchEvent(new Event('BootstrapComplete')); });
    }
}, false);
//# sourceMappingURL=boot-worker.js.map