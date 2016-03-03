import 'es6-shim';
import 'es6-promise';
import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import 'zone.js/dist/long-stack-trace-zone';

import { FormBuilder } from 'angular2/common';
import { APP_BASE_HREF, Router, ROUTER_PROVIDERS, LocationStrategy, PathLocationStrategy  } from 'angular2/router';
import { Http, HTTP_PROVIDERS } from 'angular2/http';

import { App } from './components/app/app';

// browser bootstrap
// import { bootstrap } from 'angular2/platform/browser';
//bootstrap(App, [ROUTER_BINDINGS, HTTP_PROVIDERS, FormBuilder]); 

// worker imports
import { platform, provide, ApplicationRef, ComponentRef, Injector, NgZone } from 'angular2/core';
import {
    WORKER_APP_PLATFORM,
    WORKER_APP_APPLICATION,
    WORKER_APP_ROUTER 
} from 'angular2/platform/worker_app';

// worker bootstrap
platform(WORKER_APP_PLATFORM)
    .asyncApplication(null, [
        WORKER_APP_APPLICATION,
        WORKER_APP_ROUTER,
        provide(LocationStrategy, { useClass: PathLocationStrategy }),
        provide(APP_BASE_HREF, { useValue: '/' })
    ])
    .then((appRef: ApplicationRef) => {
        console.log('Loaded application in web worker. Running bootstrapper...');
        return appRef.bootstrap(App, [
            ROUTER_PROVIDERS,
            HTTP_PROVIDERS,
            FormBuilder
        ]);
    })
    .then((compRef: ComponentRef) => {
        console.log('App bootstrap succeeded. Getting current navigation from router...');
        const injector: Injector = compRef.injector;
        const router: Router = injector.get(Router);

        return (<any>router)._currentNavigation;
    })
    .then(() => {
        setTimeout(() => {
            postMessage('APP_READY', undefined);
        });
    })
    .catch(error => {
        console.error(`An error occurred during start up: \r\n${error}`);
    });

// Basic hot reloading support. Automatically reloads and restarts the Angular 2 app each time
// you modify source files. This will not preserve any application state other than the URL.
declare var module: any;
if (module.hot) {
    module.hot.accept();
}
