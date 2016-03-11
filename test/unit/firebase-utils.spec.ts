/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

import {Observable} from '../../node_modules/rxjs/Rx';
import {FirebaseUtils} from "../../core";
import * as Sinon from 'sinon';

export function main() {
    describe('FirebaseUtils', function () {
            describe('.wrapFirebaseEvent()', function () {
                it('should return an observable', function () {
                    var firebase = <any>{
                        on: function () {
                        }
                    };

                    var observable = FirebaseUtils.wrapFirebaseEvent(firebase, 'event');

                    expect(observable instanceof Observable).toBeTruthy();
                });
                it('should not call on(eventName) on the Firebase object before a subscription is made', function () {
                    var spy = Sinon.spy();
                    var firebase = <any>{
                        on: spy
                    };

                    var observable = FirebaseUtils.wrapFirebaseEvent(firebase, 'event');


                    expect(spy.called).toBeFalsy("Did not expect .on('event') to be called.");
                });
                it('should call .on(eventName, callback: Function, errorCallback: Function) on the Firebase object after observable is subscribed to', function () {
                    var spy = Sinon.spy();
                    var firebase = <any>{
                        on: spy
                    };

                    var observable = FirebaseUtils.wrapFirebaseEvent(firebase, 'event');

                    var subscription = observable.subscribe((d) => {
                    });

                    expect(spy.called).toBeTruthy("Expected .on('event') to be called.");
                    expect(spy.calledOnce).toBeTruthy("Expected .on('event') to be called once.");
                    expect(spy.firstCall.args[0]).toEqual('event', "Expected call with 'event' to .on(eventName)");
                    expect(spy.firstCall.args[1]).not.toBeNull();
                    expect(typeof spy.firstCall.args[1] === 'function').toBe(true, 'Expected second argument to be function.');
                    expect(spy.firstCall.args[2]).not.toBeNull();
                    expect(typeof spy.firstCall.args[2] === 'function').toBe(true, 'Expected third argument to be function.');

                });
                it('should not call .off(eventName) if subscription is not disposed', function () {
                    var offSpy = Sinon.spy();
                    var firebase = <any>{
                        on: () => {
                        },
                        off: offSpy
                    };

                    var observable = FirebaseUtils.wrapFirebaseEvent(firebase, 'event');

                    var subscription = observable.subscribe((d) => {

                    });

                    expect(offSpy.called).toBeFalsy("Did not expect .off('event') to be called");
                });
                it('should call .off(eventName) if subscription is disposed', function () {
                    var offSpy = Sinon.spy();
                    var firebase = <any>{
                        on: () => {
                        },
                        off: offSpy
                    };

                    var observable = FirebaseUtils.wrapFirebaseEvent(firebase, 'event');

                    var subscription = observable.subscribe((d) => {

                    });

                    subscription.unsubscribe();

                    expect(offSpy.called).toBeTruthy("Did not expect .off('event') to be called");
                });
                it('should resolve with returned object when callback is called', function () {
                    var obj = {
                        val(){
                            return 42;
                        }
                    };
                    var firebase = <any>{
                        on (event, callback) {
                            callback(obj);
                        }
                    };

                    var spy = Sinon.spy();

                    FirebaseUtils.wrapFirebaseEvent(firebase, 'event').subscribe(spy);

                    expect(spy.called).toBe(true);
                    expect(spy.firstCall.args[0]).toEqual([obj]);
                });
            });
            describe('.wrapFirebaseAsyncCall()', function () {
                it('should not manipulate the given arguments', function () {
                    var args = [
                        'hi!',
                        'ho!'
                    ];
                    var originalArgs = args.slice();
                    FirebaseUtils.wrapFirebaseAsyncCall(null, () => {
                    }, args);

                    expect(args).toEqual(originalArgs);
                });
                it('should return a promise', function () {
                    var args = [
                        'hello',
                        'world'
                    ];

                    var promise = FirebaseUtils.wrapFirebaseAsyncCall(null, () => {
                    }, args);

                    expect(promise instanceof Promise).toBeTruthy();
                });

                it('should call the given function with a callback and the provided args', function () {
                    var spy = Sinon.spy();
                    var args = [
                        'hello',
                        'world'
                    ];

                    var promise = FirebaseUtils.wrapFirebaseAsyncCall(null, spy, args);

                    expect(spy.called).toBeTruthy('Expected given function to be called');

                    var callArgs = spy.firstCall.args;
                    expect(typeof callArgs[2] === 'function').toBeTruthy(`Expected last argument to be function. Instead was ${typeof callArgs[0]}`);
                    expect(callArgs[0]).toBe('hello');
                    expect(callArgs[1]).toBe('world');
                });

                it('should resolve with the arguments returned from the callback', function () {
                    var spy = Sinon.spy();
                    var promise = FirebaseUtils.wrapFirebaseAsyncCall(null, (callback) => {
                        callback(null, 'hello', 1);
                    }, []);

                    promise.then(spy);

                    setTimeout(() => {
                        expect(spy.called).toBe(true, 'Expected then() function to be called');
                        expect(spy.firstCall.args[0]).not.toBeNull();
                        var args = spy.firstCall.args[0];
                        expect(args).toEqual([
                            null,
                            'hello',
                            1
                        ]);
                    }, 1);
                });

                it('should error when first arg returned from the callback is not null', function () {
                    var okSpy = Sinon.spy();
                    var errorSpy = Sinon.spy();
                    var args = [];

                    var promise = FirebaseUtils.wrapFirebaseAsyncCall(null, (callback) => {
                        callback('error', 'hello', 1);
                    }, args);

                    promise.then(okSpy).catch(errorSpy);

                    setTimeout(() => {
                        expect(okSpy.called).toBe(false, 'Expected then() function to not be called');
                        expect(errorSpy.called).toBe(true, 'Expected catch() function to be called');
                        expect(errorSpy.firstCall.args[0]).toEqual('error');
                    }, 1);
                });

                it('should preserve the given context', function () {
                    var spy = Sinon.spy();
                    class test {
                        public async = spy;
                    }

                    var args = [];
                    var obj = new test();

                    var promise = FirebaseUtils.wrapFirebaseAsyncCall(obj, obj.async, args);
                    promise.then(() => {
                    });

                    expect(spy.firstCall.calledOn(obj)).toBe(true, 'Expected test.async() to be called, not async()');
                });
            });
        }
    );
}