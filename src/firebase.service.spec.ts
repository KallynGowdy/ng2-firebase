import {FirebaseService} from './firebase.service';
import * as Sinon from 'sinon';
import {Observable} from "rxjs/Rx";

export var FirebaseServiceSpec = {
    register(){
        describe('FirebaseService', function () {
                var firebase,
                    onSpy,
                    offSpy,
                    childSpy,
                    setSpy,
                    service;

                beforeEach(function () {
                    onSpy = Sinon.spy();
                    offSpy = Sinon.spy();
                    childSpy = Sinon.spy();
                    setSpy = Sinon.spy();
                    firebase = {
                        on: onSpy,
                        off: offSpy,
                        child: childSpy,
                        set: setSpy
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

                describe('child(path)', function () {
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
                        expect(spy.firstCall.args[0]).toEqual(obj);
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

                [
                    {name: 'value', event: 'value', val: true},
                    {name: 'data', event: 'value', val: true},
                    {name: 'childAdded', event: 'child_added', val: true},
                    {name: 'childChanged', event: 'child_changed', val: true},
                    {name: 'childRemoved', event: 'child_removed', val: true},
                    {name: 'valueRaw', event: 'value'},
                    {name: 'dataRaw', event: 'value'},
                    {name: 'childAddedRaw', event: 'child_added'},
                    {name: 'childChangedRaw', event: 'child_changed'},
                    {name: 'childRemovedRaw', event: 'child_removed'}
                ].forEach((m) => {
                    describe(`.${m.name}`, function () {
                        testGetterReturnsObservable(m.name);
                        if (m.val) {
                            testObservableResolvesWithVal(m.name);
                        }
                        else {
                            testObservableResolvesWithFullObj(m.name);
                        }
                        testObservableResolvesCancelCallbackAsError(m.name);
                        testGetterPassesCorrectEventName(m.name, m.event);
                    });
                });

                describe('.setData(data)', function () {
                    it('should return an observable', function () {
                        var observable = service.setData({});

                        expect(observable instanceof Observable).toBe(true);
                    });
                    it('should call .set() on internal Firebase API Instance when subscribed', function () {
                        var obj = {data: 'Yay!'};
                        service.setData(obj).subscribe(() => {
                        });

                        expect(setSpy.called).toBe(true);
                        expect(setSpy.firstCall.args[0]).toBe(obj);
                    });
                    it('should resolve complete when .set() calls given callback', function () {
                        firebase.set = (data, callback) => {
                            callback(null);
                        };
                        var completeSpy = Sinon.spy();
                        service.setData({}).subscribe(null, null, completeSpy);

                        expect(completeSpy.called).toBe(true);
                    });
                    it('should resolve with error when .set() calls given callback with value', function () {
                        firebase.set = (data, callback) => {
                            callback('error');
                        };
                        var errorSpy = Sinon.spy();
                        service.setData({}).subscribe(null, errorSpy);

                        expect(errorSpy.called).toBe(true);
                        expect(errorSpy.firstCall.args[0]).toBe('error');
                    });
                });
            }
        );
    }
};