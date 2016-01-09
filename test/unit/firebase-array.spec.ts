import * as Sinon from 'sinon';
import {FirebaseService} from '../../core';
import {Observable} from '../../node_modules/rxjs/Rx';
import {Subscription} from '../../node_modules/rxjs/Subscription';
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
import {FirebaseArray} from '../../src/firebase-array';
import {TestScheduler} from "rxjs/Rx.KitchenSink";

function createSnapshot(key:string, val:any):any {
    return {
        val(){
            return val;
        },
        key(){
            return key;
        }
    };
}

function mockService(marbles, values):FirebaseService {
    var childAdded = this.scheduler.createColdObservable(marbles.a, values);
    var childRemoved = this.scheduler.createColdObservable(marbles.b, values);
    var childChanged = this.scheduler.createColdObservable(marbles.c, values);
    var childMoved = this.scheduler.createColdObservable(marbles.d, values);
    return <any>{
        childAddedRaw: childAdded,
        childRemovedRaw: childRemoved,
        childChangedRaw: childChanged,
        childMovedRaw: childMoved
    };
}
export function main() {
    describe('FirebaseArray', function () {

        beforeEach(function () {
            this.scheduler = new TestScheduler((first, second) => {
                expect(first.length).toEqual(second.length, `Expected ${first.length} events to be observed.`);
                for (var i = 0; i < first.length; i++) {
                    var f = first[i];
                    var s = second[i];

                    expect(f.frame).toEqual(s.frame, `Expected ${i + 1}th event to occur on the ${f.frame}th frame.`);
                    expect(f.notification.value).toEqual(s.notification.value, `Expected ${JSON.stringify(s.notification.value)} to equal ${JSON.stringify(f.notification.value)} on the ${f.frame}th frame.`);
                }
                //return expect(first).toEqual(second);
            });
        });

        describe('.subscribe()', function () {
            it('should notify observer after "child_added" event', function () {

                var values = {
                    a: [createSnapshot('1', {value: 'a'}), null],
                    b: [createSnapshot('2', {value: 'b'}), 'a'],
                    c: [{value: 'a', $id: '1'}],
                    d: [{value: 'a', $id: '1'}, {value: 'b', $id: '2'}]
                };

                var marbles = {
                    a: '-a-b',
                    b: '----',
                    c: '----',
                    d: '----',

                    e: '-c-d'
                };

                var service = mockService(marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                this.scheduler.expectObservable(arr).toBe(expected, values);
                this.scheduler.flush();
            });

            it('should notify observer after "child_removed" event', function () {
                var values = {
                    a: [createSnapshot('1', {value: 'a'}), null],
                    b: [createSnapshot('1', null)],
                    e: [{value: 'a', $id: '1'}],
                    f: []
                };

                var marbles = {
                    a: '-a--',
                    b: '---b',
                    c: '----',
                    d: '----',

                    e: '-e-f'
                };

                var service = mockService(marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                this.scheduler.expectObservable(arr).toBe(expected, values);
                this.scheduler.flush();
            });

            it('should notify observer after "child_changed" event', function () {
                var values = {
                    a: [createSnapshot('1', {value: 'a'}), null],
                    b: [createSnapshot('1', {value: 'b'})],
                    1: [{value: 'a', $id: '1'}],
                    2: [{value: 'b', $id: '1'}]
                };

                var marbles = {
                    a: '-a--',
                    b: '----',
                    c: '--b-',
                    d: '----',

                    e: '-12-'
                };

                var service = mockService(marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                this.scheduler.expectObservable(arr).toBe(expected, values);
                this.scheduler.flush();
            });

            it('should notify observer after "child_moved" event', function () {
                var values = {
                    a: [createSnapshot('1', {value: 'a'}), null],
                    b: [createSnapshot('2', {value: 'b'}), '1'],
                    c: [createSnapshot('1', {value: 'a'}), '2'],
                    1: [{value: 'a', $id: '1'}],
                    2: [{value: 'a', $id: '1'}, {value: 'b', $id: '2'}],
                    3: [{value: 'b', $id: '2'}, {value: 'a', $id: '1'}]
                };

                var marbles = {
                    a: '-ab--',
                    b: '-----',
                    c: '-----',
                    d: '---c-',

                    e: '-123-'
                };

                var service = mockService(marbles, values);
                var expected = marbles.e;

                var arr = new FirebaseArray(service);

                this.scheduler.expectObservable(arr).toBe(expected, values);
                this.scheduler.flush();
            });
        })
    });
}
