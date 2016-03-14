/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

import * as Sinon from 'sinon';
import {FirebaseService} from '../../core';
import {Observable} from '../../node_modules/rxjs/Rx';
import {Subscription} from '../../node_modules/rxjs/Subscription';
import {FirebaseArray} from '../../src/firebase-array';

export function main() {
    describe('FirebaseService', function () {
            var firebase,
                onSpy,
                offSpy,
                childSpy,
                setSpy,
                updateSpy,
                service;

            beforeEach(function () {
                onSpy = Sinon.spy();
                offSpy = Sinon.spy();
                childSpy = Sinon.spy();
                setSpy = Sinon.spy();
                updateSpy = Sinon.spy();
                firebase = {
                    on: onSpy,
                    off: offSpy,
                    child: childSpy,
                    set: setSpy,
                    update: updateSpy
                };
                service = new FirebaseService(firebase);
            });

            describe('.firebase', function () {
                it('is given in the constructor', function () {
                    var obj = <any>{};
                    var firebaseService = new FirebaseService(obj);
                    expect(firebaseService.firebase).toEqual(obj);
                });
            });

            describe('.child(path)', function () {
                it('should return new FirebaseService with child service', function () {
                    var child = {};
                    var firebase = {
                        child: () => {
                            return child;
                        }
                    };

                    var service = new FirebaseService(firebase);

                    var childService = service.child('anyPath');

                    expect(childService).not.toEqual(service);
                    expect(childService instanceof FirebaseService).toBe(true);
                    expect(childService.firebase).toBe(child);
                });

                it('should pass path to service', function () {
                    var service = new FirebaseService(firebase);

                    var childService = service.child('path');

                    expect(childSpy.firstCall.args[0]).toEqual('path');
                });
            });

            function testGetterReturnsObservable(getterName:string) {
                it('should return an observable', function () {
                    var observable = service[getterName];
                    expect(observable instanceof Observable).toBe(true);
                });
            }

            function testObservableResolvesWithVal(getterName:string) {
                it('should resolve with val() when callback is called', function () {
                    firebase.on = function (event, callback) {
                        callback({
                            val(){
                                return 42;
                            }
                        });
                    };

                    var spy = Sinon.spy();

                    service[getterName].subscribe(spy);

                    expect(spy.called).toBe(true);
                    expect(spy.firstCall.args[0]).toEqual(42);
                });
            }

            function testObservableResolvesWithFullObj(getterName:string) {
                it('should resolve with full object when callback is called', function () {
                    var obj = {
                        val(){
                            return 42;
                        }
                    };
                    firebase.on = function (event, callback) {
                        callback(obj);
                    };

                    var spy = Sinon.spy();

                    service[getterName].subscribe(spy);

                    expect(spy.called).toBe(true, 'Expected callback to be called.');
                    expect(spy.firstCall.args[0]).toEqual([obj]);
                });
            }

            function testGetterPassesCorrectEventName(getterName:string, eventName:string) {
                it(`should pass '${eventName}' to on()`, function () {

                    service[getterName].subscribe(() => {
                    });

                    expect(onSpy.firstCall.args[0]).toEqual(eventName);
                });
            }

            function testObservableResolvesCancelCallbackAsError(getterName:string) {
                it('should call observable onError callback when subscription is canceled', function () {
                    firebase.on = function (event, callback, cancelCallback) {
                        cancelCallback('value');
                    };

                    var spy = Sinon.spy();

                    service[getterName].subscribe(() => {
                    }, spy);

                    expect(spy.called).toBe(true, 'Expected callback to be called.');
                    expect(spy.firstCall.args[0]).toEqual('value');
                });
            }

            function testObservableResolvesExtraArguments(getterName:string) {
                it('should resolve with extra arguments given to callback', function () {
                    var args = ['arg1', 'arg2', 'arg3', {
                        name: 'arg4'
                    }, 3, 5];
                    firebase.on = function (event, callback, cancelCallback) {
                        callback(...args);
                    };

                    var spy = Sinon.spy();

                    service[getterName].subscribe(spy);

                    expect(spy.called).toBe(true, 'Expected callback to be called.');

                    // Arguments are provided in an array
                    expect(spy.firstCall.args).toEqual([args]);
                });
            }

            [
                {name: 'value', event: 'value', val: true},
                {name: 'data', event: 'value', val: true},
                {name: 'childAdded', event: 'child_added', val: true},
                {name: 'childChanged', event: 'child_changed', val: true},
                {name: 'childRemoved', event: 'child_removed', val: true},
                {name: 'childMoved', event: 'child_moved', val: true},
                {name: 'valueRaw', event: 'value', val: false},
                {name: 'dataRaw', event: 'value', val: false},
                {name: 'childAddedRaw', event: 'child_added', val: false},
                {name: 'childChangedRaw', event: 'child_changed', val: false},
                {name: 'childRemovedRaw', event: 'child_removed', val: false},
                {name: 'childMovedRaw', event: 'child_moved', val: false}
            ].forEach((m) => {
                describe(`.${m.name}`, function () {
                    testGetterReturnsObservable(m.name);
                    if (m.val) {
                        testObservableResolvesWithVal(m.name);
                    }
                    else {
                        testObservableResolvesExtraArguments(m.name);
                        testObservableResolvesWithFullObj(m.name);
                    }
                    testObservableResolvesCancelCallbackAsError(m.name);
                    testGetterPassesCorrectEventName(m.name, m.event);
                });
            });

            describe('.setData(data)', function () {
                it('should return a Promise', function () {
                    var observable = service.setData({});

                    expect(observable instanceof Promise).toBe(true);
                });
                it('should call .set() on internal Firebase API Instance', function () {
                    var obj = {data: 'Yay!'};
                    service.setData(obj);

                    expect(setSpy.called).toBe(true);
                    expect(setSpy.firstCall.args[0]).toBe(obj);
                });
                it('should resolve true when .set() calls given callback', function (done) {
                    firebase.set = (data, callback) => {
                        callback(null);
                    };
                    var completeSpy = Sinon.spy();
                    service.setData({})
                        .then(function (good) {
                            expect(good).toBe(true);
                            done();
                        }).catch(done);
                });
                it('should resolve with error when .set() calls given callback with value', function (done) {
                    firebase.set = (data, callback) => {
                        callback('error');
                    };

                    service.setData({})
                        .catch(function (error) {
                            expect(error).toBe('error');
                            done();
                        })
                        .then(function () {
                            done('Catch was not called');
                        })
                        .catch(done);
                });
            });
            
            describe('.update(data)', function() {
                it('should return a Promise', function () {
                    var observable = service.update({});

                    expect(observable instanceof Promise).toBe(true);
                });
                it('should call .update() on internal Firebase API Instance', function () {
                    var obj = {updateKey: 'Update Value!'};
                    service.updateData(obj);

                    expect(updateSpy.called).toBe(true);
                    expect(updateSpy.firstCall.args[0]).toBe(obj);
                });
                it('should resolve true when .update() calls given callback', function (done) {
                    firebase.update = (data, callback) => {
                        callback(null);
                    };
                    service.updateData({})
                        .then(function (good) {
                            expect(good).toBe(true);
                            done();
                        }).catch(done);
                });
                it('should resolve with error when .update() calls given callback with value', function (done) {
                    firebase.update = (data, callback) => {
                        callback('error');
                    };

                    service.updateData({})
                        .catch(function (error) {
                            expect(error).toBe('error');
                            done();
                        })
                        .then(function () {
                            done('Catch was not called');
                        })
                        .catch(done);
                });
            }); 

            describe('.on(event)', function () {
                
                it('should call .on(event, callback) on firebase instance when subscribed to', function () {
                    service.on('event').subscribe(() => {
                    });

                    expect(onSpy.firstCall.args[0]).toEqual('event');
                });

                it('should return an observable', function () {
                    var observable = service.on('event');
                    expect(observable instanceof Observable).toBe(true);
                });

                it('should call resolve when Firebase calls callback', function () {
                    var obj = {
                        data: 'hello'
                    };
                    var spy = Sinon.spy();

                    firebase.on = function (event, callback) {
                        callback(obj);
                    };

                    service.on('event').subscribe(spy);

                    expect(spy.firstCall.args[0]).toEqual([obj]);
                });

                it('should resolve error when Firebase calls Error', function () {
                    var err = {
                        message: 'something'
                    };
                    var spy = Sinon.spy();
                    firebase.on = function (event, callback, error) {
                        error(err);
                    };

                    service.on('event').subscribe(null, spy);

                    expect(spy.firstCall.args[0]).toBe(err);
                });
            });

            //describe('.asArray', function () {
            //    it('should return a new FirebaseArrayService that wraps the FirebaseService', function () {
            //        var firebase = {
            //            childAddedRaw:
            //        };
            //        var firebaseService = new FirebaseService(firebase);
            //
            //        var firebaseArray = firebaseService.asArray();
            //
            //        expect(firebaseArray instanceof FirebaseArray).toBe(true);
            //    });
            //});
        }
    );
}
