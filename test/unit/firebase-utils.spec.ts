import {Observable} from '../../node_modules/rxjs/Rx';
import {FirebaseUtils} from "../../core";
import * as Sinon from 'sinon';
import {error} from "util";
import {
    AsyncTestCompleter,
    beforeEach,
    ddescribe,
    xdescribe,
    describe,
    dispatchEvent,
    expect,
    iit,
    inject,
    beforeEachProviders,
    it,
    xit,
    TestComponentBuilder,
    ComponentFixture
} from 'angular2/testing_internal';

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
                    expect(spy.firstCall.args[0]).toEqual(obj);
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
                it('should return an observable', function () {
                    var args = [
                        'hello',
                        'world'
                    ];

                    var observable = FirebaseUtils.wrapFirebaseAsyncCall(null, () => {
                    }, args);

                    expect(observable instanceof Observable).toBeTruthy();
                });

                it('should call the given function with a callback and the provided args when subscribed to', function () {
                    var spy = Sinon.spy();
                    var args = [
                        'hello',
                        'world'
                    ];

                    var observable = FirebaseUtils.wrapFirebaseAsyncCall(null, spy, args);

                    observable.subscribe(() => {
                    });

                    expect(spy.called).toBeTruthy('Expected given function to be called');

                    var callArgs = spy.firstCall.args;
                    expect(typeof callArgs[2] === 'function').toBeTruthy(`Expected last argument to be function. Instead was ${typeof callArgs[0]}`);
                    expect(callArgs[0]).toBe('hello');
                    expect(callArgs[1]).toBe('world');
                });

                it('should resolve with the arguments returned from the callback', function () {
                    var spy = Sinon.spy();
                    var observable = FirebaseUtils.wrapFirebaseAsyncCall(null, (callback) => {
                        callback(null, 'hello', 1);
                    }, []);

                    observable.subscribe(spy);

                    expect(spy.called).toBe(true, 'Expected subscribed function to be called');
                    expect(spy.firstCall.args[0]).not.toBeNull();
                    var args = spy.firstCall.args[0];
                    expect(args).toEqual([
                        null,
                        'hello',
                        1
                    ]);
                });

                it('should error when first arg returned from the callback is not null', function () {
                    var okSpy = Sinon.spy();
                    var errorSpy = Sinon.spy();
                    var args = [];

                    var observable = FirebaseUtils.wrapFirebaseAsyncCall(null, (callback) => {
                        callback('error', 'hello', 1);
                    }, args);

                    observable.subscribe(okSpy, errorSpy);

                    expect(okSpy.called).toBe(false, 'Expected OnNext subscribe function to not be called');
                    expect(errorSpy.called).toBe(true, 'Expected OnError subscribe function to be called');
                    expect(errorSpy.firstCall.args[0]).toEqual('error');
                });

                it('should be completed when the callback is completed successfully', function () {
                    var completeSpy = Sinon.spy();
                    var args = [];
                    var observable = FirebaseUtils.wrapFirebaseAsyncCall(null, (callback) => {
                        callback(null);
                    }, args);

                    observable.subscribe(() => {
                    }, () => {
                    }, completeSpy);

                    expect(completeSpy.called).toBe(true, 'Expected complete function to be called');
                    expect(completeSpy.firstCall.args.length).toBe(0, 'Expected complete function to not be called with arguments.')
                });

                it('should preserve the given context', function () {
                    var spy = Sinon.spy();
                    class test {
                        public async = spy;
                    }

                    var args = [];
                    var obj = new test();

                    var observable = FirebaseUtils.wrapFirebaseAsyncCall(obj, obj.async, args);
                    observable.subscribe(() => {
                    });

                    expect(spy.firstCall.calledOn(obj)).toBe(true, 'Expected test.async() to be called, not async()');
                });
            });
        }
    );
}