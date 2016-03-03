"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ng = require('angular2/core');
var router = require('angular2/router');
var nav_menu_1 = require('../nav-menu/nav-menu');
var home_1 = require('../home/home');
var fetch_data_1 = require('../fetch-data/fetch-data');
var counter_1 = require('../counter/counter');
var App = (function () {
    function App() {
    }
    App = __decorate([
        ng.Component({
            selector: 'app'
        }),
        router.RouteConfig([
            { path: '/', component: home_1.Home, name: 'Home' },
            { path: '/counter', component: counter_1.Counter, name: 'Counter' },
            { path: '/fetch-data', component: fetch_data_1.FetchData, name: 'FetchData' }
        ]),
        ng.View({
            template: require('./app.html'),
            directives: [nav_menu_1.NavMenu, router.ROUTER_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], App);
    return App;
}());
exports.App = App;
//# sourceMappingURL=app.js.map