import {Injectable} from "@angular/core";
import {FirebaseService} from './firebase.service';
import {Observable, Subject, ReplaySubject, Subscription} from "rxjs/Rx";

class ArrayValue {
    value: any;
    id: string;
}

// Polyfill Array.find()
if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list: any = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

// Polyfill for Array.findIndex()
if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list: any = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}

/**
 * Defines a class that provides capabilities to synchronize ordered lists for a Firebase Object.
 *
 * **Example**:
 *
 * ```TypeScript
 * import {FirebaseService} from 'ng2-firebase/core';
 *
 * // Get the Array
 * var arr = new FirebaseService(
 *    new Firebase('https://YOUR-FIREBASE-URL.firebaseio-demo.com')
 * ).asArray();
 *
 * // Use Array
 * ```
 *
 * **Angular 2 Example**:
 *
 * ```TypeScript
 * // some.component.ts
 * import { Component, OnInit, provide } from 'angular2/core';
 * import { FirebaseArray, FirebaseService, FirebaseServiceFactory } from 'ng2-firebase/core';
 * import { Observable } from 'rxjs/Rx';
 *
 * @@Component({
 *    // FirebaseServiceFactory is not Implemented yet...
 *    selector: 'some-component',
 *
 *    // Make sure to include the async pipe so that the most recent value
 *    // is resolved from the data observable.
 *    template:
 *      'I have {{users.length}} users!' +
 *      '<div *ngFor="#user of (users.observable | async)">' +
 *      '   {{user.name}}' +
 *      '</div>' +
 *      '<h2>Users over 18:</h2>' +
 *      '<div *ngFor="#user of (over18 | async)>' +
 *      ' {{user.name}}' +
 *      '</div>' +,
 *
 *    // Declare the providers that should be used for the service.
 *    providers: [
 *      provide(
 *          FirebaseArray,
 *          {
 *              useValue: new FirebaseService(
 *                  new Firebase('https://YOUR-FIREBASE-URL.firebaseio-demo.com')
 *              ).asArray()
 *          }
 *      )
 *    ]
 * })
 * export class SomeComponent implements OnInit {
 *   private users: FirebaseArray;
 *   private over18: Observable<User>;
 *
 *   constructor(users: FirebaseArray) {
 *      this.users = users;
 *   }
 *
 *   findOver18(): Observable<User> {
 *      this.over18 = this.users.filter(u => u.age > 18);
 *   }
 *
 *   ngOnInit() {
 *      findOver18();
 *   }
 * }
 * ```
 *
 */
@Injectable()
export class FirebaseArray<T> {
    
    /**
     * Whether inner array should be copied when notifying observers.
     * Defaults to true.
     * @type {boolean}
     */
    public copyArray: boolean = true;

    private _service: FirebaseService<T[]>;
    private _list: ArrayValue[];
    private _arr: any[];
    private _subject: Subject<ArrayValue[]>;

    /**
     * @type {boolean}
     * @private
     */
    private _initialized: boolean = false;

    /**
     * Creates a new FirebaseArray using the given FirebaseService.
     * @param firebaseService
     */
    constructor(firebaseService: FirebaseService<T[]>) {
        this._subject = new ReplaySubject<ArrayValue[]>(1);
        this._service = firebaseService;
        this._list = [];
        this._arr = [];
        this._init();
    }

    /**
     * Adds the given data to the end of this array.
     * Returns a promise that represents the async operation.
     * @param data The data that should be added to the data structure.
     * @returns {Promise<boolean>}
     */
    add(data: T): Promise<boolean> {
        if (typeof data === 'undefined' || data === null) {
            throw new Error(
                'Cannot add nulls to synchronized array as they cannot be reliably tracked. ' +
                'If you want a "null"-like value, use a special trigger value, such as a custom Unit or Void object.');
        }
        return this._service.push(data);
    }

    /**
     * Removes the child at the given index(a.k.a. key) from this array.
     * @param index The key of the child that should be removed from the data structure.
     * @returns {Promise<boolean>}
     */
    remove(index: (string | number)): Promise<boolean> {
        if (index === null) {
            throw new Error('The provided index is invalid. Please make sure that it is in the range of 0 - array.length');
        }
        return this._service.remove(index.toString());
    }

    /**
     * Sets the data stored at the given index (a.k.a. key).
     * @param index The key of the child whose data should be replaced.
     * @param data The data that the child should be replaced with.
     * @returns {Promise<boolean>}
     */
    set(index: (string | number), data: T): Promise<boolean> {
        if (data.hasOwnProperty('$id')) {
            delete (<any>data).$id
        }
        return this._service.child(index.toString()).set(data);
    }

    /**
     * Gets an observable that resolves with the index of the given key is found.
     * @param key
     * @returns {Observable<number>}
     */
    indexOfKey(key: (string | number)): Observable<number> {
        return this._subject.map(arr => FirebaseArray._getPositionFor(key.toString(), arr)).distinctUntilChanged();
    }

    /**
     * Gets an observable that resolves whenever the index of the given value is found.
     * @param val
     * @param fromIndex
     * @returns {Observable<number>}
     */
    indexOf(val: T): Observable<number> {
        return this.observable.map(arr => {
            return arr.indexOf(val);
        }).distinctUntilChanged();
    }

    /**
     * Filters each of the elements in the observed arrays based on whether they match the provided comparison function.
     * @param callback
     * @param thisArg
     */
    filter(callback: (val: T, index: number, arr: T[]) => boolean, thisArg?: any): Observable<any[]> {
        return this.observable.map(arr => {
            return arr.filter(callback, thisArg);
        });
    }

    /**
     * Maps each observed array to a new array that is made up of the results of calling the given callback function.
     * @param callback
     * @param thisArg
     */
    map<U>(callback: (val: T, index: number, arr: T[]) => U, thisArg?: any): Observable<U[]> {
        return this.observable.map(arr => arr.map(callback, thisArg));
    }

    /**
     * Returns an observable that resolves whenever a new value is found in the underlying array.
     * If the value was removed, or was originally not present in the array, `undefined` is returned.
     * @param callback The function that is used to determine if a value is "found".
     * @param thisArg The object that the callback should be called on.
     * @returns {Observable<any>}
     */
    find(callback: (val: T, index: number, arr: T[]) => boolean, thisArg?: any): Observable<any> {
        return this.observable.map(arr => arr.find(callback, thisArg)).distinctUntilChanged();
    }

    /**
     * Returns an observable that resolves with the index of the item whenever a new value is found in the underlying array.
     * If the value was removed, or was originally not present in the array, `-1` is returned.
     * @param callback The function that is used to determine if a value is "found".
     * @param thisArg The object that the callback should be called on.
     * @returns {Observable<any>}
     */
    findIndex(callback: (val: T, index: number, arr: T[]) => boolean, thisArg?: any): Observable<number> {
        // <any> cast is to get typescript compiler to ignore "incorrect" arguments
        return this.observable.map(arr => arr.findIndex(<any>callback, thisArg)).distinctUntilChanged();
    }

    /**
     * Registers handlers for notification when this array is updated.
     * @param onNext
     * @param onError
     * @param onComplete
     * @returns {Subscription}
     */
    subscribe(onNext?: (value: T[]) => void, onError?: (error: any) => void, onComplete?: () => void): Subscription {
        return this.observable.subscribe(onNext, onError, onComplete);
    }

    /**
     * Gets the underlying service for this array.
     * @returns {FirebaseService}
     */
    get service(): FirebaseService<T[]> {
        return this._service;
    }

    /**
     * Gets an observable for the length of the array.
     * @returns {Observable<number>}
     */
    get length(): Observable<number> {
        return this.observable.map(a => a.length).distinctUntilChanged();
    }

    /**
     * Gets the array that is currently stored in this service.
     * @returns {*[]}
     */
    get array(): T[] {
        return this.copyArray ? FirebaseArray._mapArrayValues(this._list) : this._arr;
    }

    /**
     * Gets an observable that notifies whenever the underlying array is updated.
     * @returns {Observable<any>}
     */
    get observable(): Observable<T[]> {
        return this.copyArray ? this._subject.map(FirebaseArray._mapArrayValues) : this._subject.map((arr) => this._arr);
    }

    private static _mapArrayValues(arr: ArrayValue[]) {
        return arr.map(v => v.value);
    }

    /**
     * @private
     */
    private _init() {
        if (!this._initialized) {
            this._subscribeToEvent(this._service.childAddedRaw, this._childAdded.bind(this));
            this._subscribeToEvent(this._service.childRemovedRaw, this._childRemoved.bind(this));
            this._subscribeToEvent(this._service.childChangedRaw, this._childChanged.bind(this));
            this._subscribeToEvent(this._service.childMovedRaw, this._childMoved.bind(this));
            this._initialized = true;
        }
    }

    /**
     * @param observable
     * @param reciever
     * @private
     */
    private _subscribeToEvent(observable: Observable<any[]>, reciever: Function) {
        observable.subscribe(this._wrap(reciever), this._subject.error.bind(this._subject), this._subject.complete.bind(this._subject));
    }

    /**
     * @param func
     * @returns {function(any[]): undefined}
     * @private
     */
    private _wrap(func: Function) {
        return (args: any[]) => {
            var child: FirebaseDataSnapshot = args[0];
            func(child.val(), child.key, ...args);
        }
    }

    /**
     * @param key
     * @param list
     * @returns {number}
     * @private
     */
    private static _getPositionFor(key: string, list: ArrayValue[]) {
        for (var i = 0; i < list.length; i++) {
            var v = list[i];
            if (v.id === key) {
                return i;
            }
        }
        return -1;
    }

    /**
     * @param prevChildKey
     * @param list
     * @returns {any}
     * @private
     */
    private static _getPositionAfter(prevChildKey: string, list: ArrayValue[]) {
        if (prevChildKey === null) {
            return 0;
        }
        else {
            var i = FirebaseArray._getPositionFor(prevChildKey, list);
            if (i === -1) {
                return list.length;
            }
            else {
                return i + 1;
            }
        }
    }

    private _emit() {
        this._subject.next(this._list);
    }

    /**
     * @param child
     * @private
     */
    private _childAdded(val: any, key: string, snap: FirebaseDataSnapshot, prevChild: any): void {
        var value: ArrayValue = {
            value: val,
            id: key
        };
        var pos = FirebaseArray._getPositionAfter(prevChild, this._list);
        this._applyChildAdded(pos, value);
    }
    
    /**
     * Applies the child_added event handler logic to the arrays.
     */
    private _applyChildAdded(pos: number, value: ArrayValue): void {
        this._list.splice(pos, 0, value);
        this._arr.splice(pos, 0, value.value);
        this._emit();
    }

    /**
     *
     * @param child
     * @private
     */
    private _childRemoved(val: any, key: string) {
        var pos = FirebaseArray._getPositionFor(key, this._list);
        this._applyChildRemoved(pos);
    }
    
    /**
     * Applies the child_removed event handler logic to the arrays.
     */
    private _applyChildRemoved(pos: number): void {
        if (pos > -1) {
            this._list.splice(pos, 1);
            this._arr.splice(pos, 1);
            this._emit();
        }
    }

    /**
     * @param child
     * @private
     */
    private _childMoved(val: any, key: string, snap: FirebaseDataSnapshot, prevChildKey: any) {
        var pos = FirebaseArray._getPositionFor(key, this._list);
        var newPos = FirebaseArray._getPositionAfter(prevChildKey, this._list);
        this._applyChildMoved(pos, newPos);
    }

    /**
     * Applies the child_moved event handler logic to the given array.
     */
    private _applyChildMoved(pos: number, newPos: number): void {
        if (pos > -1) {
            FirebaseArray._moveValue(this._list, pos, newPos);
            FirebaseArray._moveValue(this._arr, pos, newPos);
            this._emit();
        }
    }

    /**
     * Moves the value in the given array at the given position to the given new position. 
     */
    private static _moveValue(arr: any[], pos: number, newPos: number): void {
        var data = arr.splice(pos, 1)[0];
        arr.splice(newPos, 0, data);
    }

    /**
     * @param child
     * @private
     */
    private _childChanged(val: any, key: string) {
        var pos = FirebaseArray._getPositionFor(key, this._list);
        this._applyChildChanged(pos, val, key);
    }
    
    /**
     * Applies the child_moved event handler logic to the given array.
     */
    private _applyChildChanged(pos: number, newValue: any, newKey: string): void {
        if (pos > -1) {
            this._list[pos] = {
                value: newValue,
                id: newKey
            };
            this._arr[pos] = newValue;
            this._emit();
        }
    }
}