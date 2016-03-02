import 'angular2/bundles/angular2-polyfills.js';
import 'bootstrap';
import './styles/site.css';
import 'es6-shim';
import 'es6-promise';
import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import 'zone.js/dist/long-stack-trace-zone';

import { FormBuilder } from 'angular2/common';
import * as router from 'angular2/router';
import { Http, HTTP_PROVIDERS } from 'angular2/http';
import { App } from './components/app/app';

import { platform, provide, ApplicationRef, ComponentRef, Injector } from 'angular2/core';
import {
WORKER_APP_PLATFORM,
WORKER_APP_APPLICATION,
WORKER_APP_ROUTER
} from 'angular2/platform/worker_app';
import { APP_BASE_HREF, Router } from 'angular2/router';

platform(WORKER_APP_PLATFORM).asyncApplication(() => Promise.resolve([
    WORKER_APP_APPLICATION,
    WORKER_APP_ROUTER,
    provide(APP_BASE_HREF, { useValue: '/' }),
]))
    .then((appRef: ApplicationRef) => {
        return appRef.bootstrap(App, [router.ROUTER_BINDINGS, HTTP_PROVIDERS, FormBuilder]);
    })
    .then((compRef: ComponentRef) => {
        const injector: Injector = compRef.injector;
        const router: Router = injector.get(Router);

        return (<any>router)._currentNavigation;
    })
    .then(() => {
        setTimeout(() => {
            postMessage('APP_READY', undefined);
        });
    });

// Basic hot reloading support. Automatically reloads and restarts the Angular 2 app each time
// you modify source files. This will not preserve any application state other than the URL.
declare var module: any;
if (module.hot) {
    module.hot.accept();
}
