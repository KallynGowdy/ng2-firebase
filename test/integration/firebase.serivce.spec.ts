/// <reference path="../../core.ts"/>
/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

import {Component, Provider, Injector, ComponentMetadata, View, ViewMetadata, Injectable, provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {FirebaseProvider, FirebaseService, FirebaseServiceProvider} from "../../core";
@Component({
    selector: 'test-component',
    template: '<p>{{data}}</p>'
})
class TestComponent {
    constructor(public firebase: FirebaseService<any>) {

    }
}

export function main() {
    describe('FirebaseService', function() {
        beforeEach(function() {
            this.element = document.createElement('test-component');
            document.body.appendChild(this.element);
        });

        afterEach(function() {
            if (this.element && document.body.contains(this.element)) {
                document.body.removeChild(this.element);
            }
        });

        it('should be able to use custom provider to build FirebaseSerivce', function(done) {
            var firebase = {};

            bootstrap(TestComponent, [provide(FirebaseService, { useValue: firebase })]).then(component => {
                expect(component.instance).not.toBe(null);
                expect(component.instance.firebase).toBe(firebase);
                component.dispose();
                done();
            }, err => done(err));
        });

        it('should be able to use FirebaseServiceProvider to build FirebaseService', function (done) {
            var firebase = {
                a: 'b'
            };

            bootstrap(TestComponent, [FirebaseServiceProvider, provide('Firebase', {useValue: firebase})]).then(component => {
                expect(component.instance).not.toBe(null);
                expect(component.instance.firebase.firebase).toBe(firebase);
                component.dispose();
                done();
            }, err => done(err));
        });
    });
}