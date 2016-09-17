/// <reference path="../../typings/jasmine/jasmine.d.ts"/>

import * as Sinon from 'sinon';
import {FirebaseService} from '../../core';
import {Observable, Subject} from '../../node_modules/rxjs/Rx';
import {Subscription} from '../../node_modules/rxjs/Subscription';
import {FirebaseArray} from '../../src/firebase-array';
import {TestScheduler} from '../../node_modules/rxjs/testing/TestScheduler';

function createSnapshot(key: string, val: any): any {
    return {
        val() {
            return val;
        },
        get key() {
            return key;
        }
    };
}

function mockService(scheduler: TestScheduler, marbles?, values?): FirebaseService<any> {
    var safeMarbles = marbles || {
        a: '----',
        b: '----',
        c: '----',
        d: '----',
        e: '----'
    };
    var safeValues = values || {};
    var childAdded = scheduler.createColdObservable(safeMarbles.a, safeValues);
    var childRemoved = scheduler.createColdObservable(safeMarbles.b, safeValues);
    var childChanged = scheduler.createColdObservable(safeMarbles.c, safeValues);
    var childMoved = scheduler.createColdObservable(safeMarbles.d, safeValues);
    return <any>{
        childAddedRaw: childAdded,
        childRemovedRaw: childRemoved,
        childChangedRaw: childChanged,
        childMovedRaw: childMoved
    };
}
export function main() {
    describe('FirebaseArray', function () {
        var setupScheduler = (): TestScheduler => {
            return new TestScheduler((first, second) => {
                expect(first.length).toEqual(second.length, `Expected ${first.length} events to be observed.`);
                for (var i = 0; i < first.length; i++) {
                    var f = first[i];
                    var s = second[i];

                    expect(f.frame).toEqual(s.frame, `Expected ${i + 1}th event to occur on the ${f.frame}th frame.`);
                    expect(f.notification.value).toEqual(s.notification.value, `Expected ${JSON.stringify(s.notification.value)} to equal ${JSON.stringify(f.notification.value)} on the ${f.frame}th frame.`);
                }
                //return expect(first).toEqual(second);
            });
        };

        describe('.subscribe()', function () {
            it('should notify observer after "child_added" event', function () {
                var scheduler = setupScheduler();

                var values = {
                    a: [createSnapshot('1', { value: 'a' }), null],
                    b: [createSnapshot('2', { value: 'b' }), 'a'],
                    c: [{ value: 'a' }],
                    d: [{ value: 'a' }, { value: 'b' }]
                };

                var marbles = {
                    a: '-a-b',
                    b: '----',
                    c: '----',
                    d: '----',

                    e: '-c-d'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                scheduler.expectObservable(<any>arr).toBe(expected, values);
                scheduler.flush();
            });
            it('should notify observer after "child_removed" event', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', { value: 'a' }), null],
                    b: [createSnapshot('1', null)],
                    e: [{ value: 'a' }],
                    f: []
                };

                var marbles = {
                    a: '-a--',
                    b: '---b',
                    c: '----',
                    d: '----',

                    e: '-e-f'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                scheduler.expectObservable(<any>arr).toBe(expected, values);
                scheduler.flush();
            });
            it('should notify observer after "child_changed" event', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', { value: 'a' }), null],
                    b: [createSnapshot('1', { value: 'b' })],
                    1: [{ value: 'a' }],
                    2: [{ value: 'b' }]
                };

                var marbles = {
                    a: '-a--',
                    b: '----',
                    c: '--b-',
                    d: '----',

                    e: '-12-'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                scheduler.expectObservable(<any>arr).toBe(expected, values);
                scheduler.flush();
            });
            it('should notify observer after "child_moved" event', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', { value: 'a' }), null],
                    b: [createSnapshot('2', { value: 'b' }), '1'],
                    c: [createSnapshot('1', { value: 'a' }), '2'],
                    1: [{ value: 'a' }],
                    2: [{ value: 'a' }, { value: 'b' }],
                    3: [{ value: 'b' }, { value: 'a' }]
                };

                var marbles = {
                    a: '-ab--',
                    b: '-----',
                    c: '-----',
                    d: '---c-',

                    e: '-123-'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                scheduler.expectObservable(<any>arr).toBe(expected, values);
                scheduler.flush();
            });
            it('should handle primitive values', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', 'Hello, World'), null],

                    // Change 'Hello, World' to 'Hello'
                    b: [createSnapshot('1', 'Hello')],

                    // Add ', World' after 'Hello'
                    c: [createSnapshot('2', ', World'), '1'],

                    // Change ', World' to ', '
                    d: [createSnapshot('2', ', ')],

                    // Add 'World' after ', '
                    e: [createSnapshot('3', 'World'), '2'],

                    1: ['Hello, World'],
                    2: ['Hello'],
                    3: ['Hello', ', World'],
                    4: ['Hello', ', '],
                    5: ['Hello', ', ', 'World']
                };

                var marbles = {
                    a: '-a-c-e',
                    b: '------',
                    c: '--b-d-',
                    d: '------',

                    e: '-12345'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                scheduler.expectObservable(<any>arr).toBe(expected, values);
                scheduler.flush();
            });
            it('should notify observer with the initial array values', () => {
                var childAddedSubject = new Subject<any>();
                var service = {
                    childAddedRaw: childAddedSubject,
                    childRemovedRaw: new Subject<any>(),
                    childChangedRaw: new Subject<any>(),
                    childMovedRaw: new Subject<any>()
                };

                var arr = new FirebaseArray<string>(<any>service);
                childAddedSubject.next([createSnapshot('1', 'Hello'), null]);

                var events: string[][] = [];
                arr.subscribe(a => events.push(a));

                expect(events.length).toBe(1);
                expect(events[0].length).toBe(1);
                expect(events[0][0]).toBe('Hello');
            });
            it('should notify late observer with current array values', () => {
                var childAddedSubject = new Subject<any>();
                var service = {
                    childAddedRaw: childAddedSubject,
                    childRemovedRaw: new Subject<any>(),
                    childChangedRaw: new Subject<any>(),
                    childMovedRaw: new Subject<any>()
                };

                var arr = new FirebaseArray<string>(<any>service);
                childAddedSubject.next([createSnapshot('1', 'Hello'), null]);

                var events: string[][] = [];
                arr.subscribe(a => events.push(a));

                childAddedSubject.next([createSnapshot('2', 'Great!'), '1']);

                var otherEvents: string[][] = [];
                arr.subscribe(a => otherEvents.push(a));

                expect(otherEvents.length).toBe(1);
                expect(otherEvents[0].length).toBe(2);
                expect(otherEvents[0][0]).toBe('Hello');
                expect(otherEvents[0][1]).toBe('Great!');
            });
        });

        var testCallFunctionOnService = function (testName, arrayName, serviceName, data, expected?) {
            it(testName, function () {
                var spy = Sinon.spy();
                var service = mockService(setupScheduler());
                service[serviceName] = spy;
                var arr = new FirebaseArray(service);

                arr[arrayName](data);

                expect(spy.called).toBe(true, `Expected ${serviceName}() spy to be called`);
                expect(spy.firstCall.args[0]).toBe(expected || data);
            });
        };

        var testReturnsWhatServiceReturns = function (testName, arrayName, serviceName, data, returned) {
            it(testName, function () {
                var stub = Sinon.stub();
                stub.returns(returned);
                var service = mockService(setupScheduler());
                service.push = stub;
                var arr = new FirebaseArray(service);

                var r = arr.add(data);

                expect(r).toBe(returned, `Expected ${arrayName}() to return stubbed value`);
            });
        };

        describe('.add(data)', function () {
            testCallFunctionOnService(
                'should call push() on the underlying service',
                'add',
                'push',
                [
                    {
                        val: 1,
                        hello: 'hello'
                    }
                ]);

            testReturnsWhatServiceReturns(
                'should return what push() returns',
                'add',
                'push',
                {
                    val: 1,
                    hello: 'hello'
                },
                {
                    value: true
                }
            );

            it('should reject nulls', function () {
                var service = mockService(setupScheduler());
                var arr = new FirebaseArray(service);

                expect(() => {
                    arr.add(null);
                }).toThrow(new Error(
                    'Cannot add nulls to synchronized array as they cannot be reliably tracked. ' +
                    'If you want a "null"-like value, use a special trigger value, such as a custom Unit or Void object.'));
            });
        });

        describe('.remove(index)', function () {
            testCallFunctionOnService(
                'it should call .remove() on the underlying service',
                'remove',
                'remove',
                0,
                '0');

            testReturnsWhatServiceReturns(
                'should return what .remove() returns',
                'remove',
                'remove',
                0,
                {
                    val: 'test'
                }
            );

            it('should reject nulls', function () {
                var service = mockService(setupScheduler());
                var arr = new FirebaseArray(service);

                expect(() => {
                    arr.remove(null);
                }).toThrow(new Error(
                    'The provided index is invalid. Please make sure that it is in the range of 0 - array.length'
                ));
            });
        });

        describe('.set(index, data)', function () {
            it('should call child().set() on the underlying service', function () {
                var setSpy = Sinon.spy();
                var childStub = Sinon.stub();
                childStub.returns({
                    set: setSpy
                });

                var service = mockService(setupScheduler());
                service.child = childStub;
                var arr = new FirebaseArray(service);
                var data = {
                    newData: 'test'
                };
                arr.set(0, data);

                expect(childStub.called).toBe(true, `Expected child() stub to be called`);
                expect(childStub.firstCall.args[0]).toBe('0');
                expect(setSpy.called).toBe(true, 'Expected set() spy to be called');
                expect(setSpy.firstCall.args[0]).toBe(data);
            });

            it('should return whatever child().set() returns', function () {
                var returned = {
                    returned: true
                };

                var setStub = Sinon.stub();
                var childStub = Sinon.stub();
                childStub.returns({
                    set: setStub
                });
                setStub.returns(returned);

                var service = mockService(setupScheduler());
                service.child = childStub;
                var arr = new FirebaseArray(service);
                var data = {
                    newData: 'test'
                };
                var r = arr.set(0, data);

                expect(r).toBe(returned);
            });
        });

        describe('.length', function () {
            it('should return an observable that updates when the length updates', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', { value: 'a' }), null],
                    b: [createSnapshot('2', { value: 'b' }), 'a'],
                    c: [createSnapshot('1', null)],
                    1: 1,
                    2: 2,
                    3: 1
                };

                var marbles = {
                    a: '-a-b-',
                    b: '----c',
                    c: '-----',
                    d: '-----',

                    e: '-1-23'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                scheduler.expectObservable(arr.length).toBe(expected, values);
                scheduler.flush();
            });
        });

        describe('.indexOfKey()', function () {
            it('should return an observable that updates when the index of a value changes', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', { value: 'a' }), null],
                    b: [createSnapshot('2', { value: 'b' }), 'a'],
                    c: [createSnapshot('2', null), null],
                    1: 0,
                    3: 1
                };

                var marbles = {
                    a: '-a-b-',
                    b: '-----',
                    c: '-----',
                    d: '----c',

                    e: '-1--3'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                scheduler.expectObservable(arr.indexOfKey('1')).toBe(expected, values);
                scheduler.flush();
            });
        });

        describe('.indexOf()', function () {
            it('should return an observable that updates when the index of a value changes', function () {
                var scheduler = setupScheduler();
                var val = { value: 'a' };
                var values = {
                    a: [createSnapshot('1', val), null],
                    b: [createSnapshot('2', { value: 'b' }), 'a'],
                    c: [createSnapshot('2', null), null],
                    1: 0,
                    3: 1
                };

                var marbles = {
                    a: '-a-b-',
                    b: '-----',
                    c: '-----',
                    d: '----c',

                    e: '-1--3'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                scheduler.expectObservable(arr.indexOf(val)).toBe(expected, values);
                scheduler.flush();
            });
        });

        describe('.filter()', function () {
            it('should return an observable that updates with the filtered array', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', 'Hello, World!'), null],
                    b: [createSnapshot('2', 'Meh.'), '1'],
                    c: [createSnapshot('3', 'This is Great!'), '2'],
                    d: [createSnapshot('4', 'Bah Humbug'), '3'],

                    // Everything should contain an exclamation point
                    1: ['Hello, World!'],
                    2: ['Hello, World!'],
                    3: ['Hello, World!', 'This is Great!'],
                    4: ['Hello, World!', 'This is Great!']
                };

                var marbles = {
                    a: '-abcd',
                    b: '-----',
                    c: '-----',
                    d: '-----',

                    e: '-1234'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);
                var spy = Sinon.spy(val => val.indexOf('!') >= 0);
                var _this = {};
                var filtered = arr.filter(spy, _this);

                scheduler.expectObservable(filtered).toBe(expected, values);
                scheduler.flush();
                expect(spy.alwaysCalledOn(_this));
            });
        });

        describe('.map()', function () {
            it('should return an observable that updates with the mapped array', function () {
                var scheduler = setupScheduler();
                var helloWorldLength = 'Hello, World!'.length;
                var mehLength = 'Meh.'.length;
                var thisIsGreatLength = 'This is Great!'.length;
                var bahHumbugLength = 'Bah Humbug'.length;

                var values = {
                    a: [createSnapshot('1', 'Hello, World!'), null],
                    b: [createSnapshot('2', 'Meh.'), '1'],
                    c: [createSnapshot('3', 'This is Great!'), '2'],
                    d: [createSnapshot('4', 'Bah Humbug'), '3'],

                    1: [helloWorldLength],
                    2: [helloWorldLength, mehLength],
                    3: [helloWorldLength, mehLength, thisIsGreatLength],
                    4: [helloWorldLength, mehLength, thisIsGreatLength, bahHumbugLength]
                };

                var marbles = {
                    a: '-abcd',
                    b: '-----',
                    c: '-----',
                    d: '-----',

                    e: '-1234'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);
                var spy = Sinon.spy(val => val.length);
                var _this = {};
                var mapped = arr.map(spy, _this);

                scheduler.expectObservable(mapped).toBe(expected, values);
                scheduler.flush();
                expect(spy.alwaysCalledOn(_this));
            });
        });

        describe('.find()', function () {
            it('should return an observable that only updates with the found item', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', 'Hello, World!'), null],
                    b: [createSnapshot('2', 'Meh.'), '1'],
                    c: [createSnapshot('3', 'This is Great!'), '2'],
                    d: [createSnapshot('4', 'Bah Humbug'), '3'],

                    1: undefined,
                    2: 'This is Great!'
                };

                var marbles = {
                    a: '-abcd',
                    b: '-----',
                    c: '-----',
                    d: '-----',

                    e: '-1-2-'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);
                var spy = Sinon.spy(val => val.indexOf('is') >= 0);
                var _this = {};
                var found = arr.find(spy, _this);

                scheduler.expectObservable(found).toBe(expected, values);
                scheduler.flush();
                expect(spy.alwaysCalledOn(_this));
            });
        });

        describe('.findIndex()', function () {
            it('should return an observable that only updates with the found item', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', 'Hello, World!'), null],
                    b: [createSnapshot('2', 'Meh.'), '1'],
                    c: [createSnapshot('3', 'This is Great!'), '2'],
                    d: [createSnapshot('4', 'Bah Humbug'), '3'],

                    1: -1,
                    2: 2
                };

                var marbles = {
                    a: '-abcd',
                    b: '-----',
                    c: '-----',
                    d: '-----',

                    e: '-1-2-'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);
                var spy = Sinon.spy(val => val.indexOf('is') >= 0);
                var _this = {};
                var found = arr.findIndex(spy, _this);

                scheduler.expectObservable(found).toBe(expected, values);
                scheduler.flush();
                expect(spy.alwaysCalledOn(_this));
            });
        });

        describe('.copyArray', function () {
            it('should produce different array instances between updates when copyArray = true', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', { value: 'a' }), null],
                    b: [createSnapshot('1', { value: 'b' })],
                    1: [{ value: 'a' }],
                    2: [{ value: 'b' }]
                };

                var marbles = {
                    a: '-a--',
                    b: '----',
                    c: '--b-',
                    d: '----',

                    e: '-12-'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);
                arr.copyArray = true;

                var arrays = [];
                arr.subscribe((items) => {
                    arrays.push(items);
                });

                scheduler.flush();

                expect(arrays.length).toBe(2);
                arrays.forEach((array, index) => {
                    var otherArrays = arrays.slice(index - 1, index);
                    otherArrays.forEach(otherArray => {
                        expect(array).not.toBe(otherArray);
                    });
                });
            });
            it('should produce the same array instance between updates when copyArray = false', function () {
                var scheduler = setupScheduler();
                var values = {
                    a: [createSnapshot('1', { value: 'a' }), null],
                    b: [createSnapshot('1', { value: 'b' })],
                    1: [{ value: 'a' }],
                    2: [{ value: 'b' }]
                };

                var marbles = {
                    a: '-a--',
                    b: '----',
                    c: '--b-',
                    d: '----',

                    e: '-12-'
                };

                var service = mockService(scheduler, marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);
                arr.copyArray = false;

                var arrays = [];
                arr.subscribe((items) => {
                    arrays.push(items);
                });

                scheduler.flush();

                expect(arrays.length).toBe(2);
                arrays.forEach(array => {
                    expect(array).toBe(arrays[0]);
                });
            });
        });
    });
}
