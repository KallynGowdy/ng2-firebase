import {Injectable} from "angular2/core";
import {FirebaseService} from './firebase.service';
import {Observable, Subject, Subscription} from "rxjs/Rx";

class ArrayValue {
    value:any;
    id:string;
}

/**
 * Defines a class that provides capabilities to synchronize ordered lists for a Firebase Object.
 *
 * **Example**:
 *
 * ```TypeScript
 * import {FirebaseService} from 'firebase-angular2/core';
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
 * import { FirebaseArray, FirebaseService, FirebaseServiceFactory } from 'firebase-angular2/core';
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
 *      '<div *ngFor="#user of (users | async)">' +
 *      '   {{user}}' +
 *      '</div>',
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
 * export class SomeComponent {
 *   private users: FirebaseArray;
 *
 *   constructor(users: FirebaseArray) {
 *      // We don't need to retrieve an observable
 *      // because FirebaseArray is an observable.
 *      this.users = users;
 *   }
 * }
 * ```
 *
 */
@Injectable()
export class FirebaseArray {
    private _service:FirebaseService;
    private _list:ArrayValue[];
    private _subject:Subject<ArrayValue[]>;

    /**
     * @type {boolean}
     * @private
     */
    private _initialized:boolean = false;

    /**
     * Creates a new FirebaseArray using the given FirebaseService.
     * @param firebaseService
     */
    constructor(firebaseService:FirebaseService) {
        this._subject = new Subject();
        this._service = firebaseService;
        this._list = [];
        this._init();
    }

    /**
     * Adds the given data to the end of this array.
     * Returns a promise that represents the async operation.
     * @param data The data that should be added to the data structure.
     * @returns {Promise<boolean>}
     */
    add(data:any):Promise<boolean> {
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
    remove(index:(string|number)):Promise<boolean> {
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
    set(index:(string|number), data:any):Promise<boolean> {
        if (data.hasOwnProperty('$id')) {
            delete data.$id
        }
        return this._service.child(index.toString()).set(data);
    }

    /**
     * Gets the of the member with the given key.
     * @param key
     * @returns {number|number}
     */
    indexOf(key:(string|number)):Observable<number> {
        return this._subject.map(arr => FirebaseArray._getPositionFor(key.toString(), arr));
    }

    /**
     * Registers handlers for notification when this array is updated.
     * @param onNext
     * @param onError
     * @param onComplete
     * @returns {Subscription<any[]>}
     */
    subscribe(onNext?:(value:any[]) => void, onError?:(error:any) => void, onComplete?:() => void):Subscription<any[]> {
        return this._arrayObservable.subscribe(onNext, onError, onComplete);
    }

    /**
     * Gets the underlying service for this array.
     * @returns {FirebaseService}
     */
    get service():FirebaseService {
        return this._service;
    }

    /**
     * Gets an observable for the length of the array.
     * @returns {Observable<number>}
     */
    get length():Observable<number> {
        return this._arrayObservable.map(a => a.length).distinctUntilChanged();
    }

    /**
     * Gets the array that is currently stored in this service.
     * @returns {*[]}
     */
    get array():any[] {
        return FirebaseArray._mapArrayValues(this._list);
    }

    private get _arrayObservable():Observable<any[]> {
        return this._subject.map(FirebaseArray._mapArrayValues);
    }

    private static _mapArrayValues(arr:ArrayValue[]) {
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
    private _subscribeToEvent(observable:Observable<any[]>, reciever:Function) {
        observable.subscribe(this._wrap(reciever), this._subject.error.bind(this._subject), this._subject.complete.bind(this._subject));
    }

    /**
     * @param func
     * @returns {function(any[]): undefined}
     * @private
     */
    private _wrap(func:Function) {
        return (args:any[]) => {
            var child:FirebaseDataSnapshot = args[0];
            func(child.val(), child.key(), ...args);
        }
    }

    /**
     * @param key
     * @param list
     * @returns {number}
     * @private
     */
    private static _getPositionFor(key:string, list:ArrayValue[]) {
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
    private static _getPositionAfter(prevChildKey:string, list:ArrayValue[]) {
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
    private _childAdded(val:any, key:string, snap:FirebaseDataSnapshot, prevChild:any):void {
        var value:ArrayValue = {
            value: val,
            id: key
        };
        var pos = FirebaseArray._getPositionAfter(prevChild, this._list);
        this._list.splice(pos, 0, value);
        this._emit();
    }

    /**
     *
     * @param child
     * @private
     */
    private _childRemoved(val:any, key:string) {
        var pos = FirebaseArray._getPositionFor(key, this._list);
        if (pos > -1) {
            this._list.splice(pos, 1);
            this._emit();
        }
    }

    /**
     * @param child
     * @private
     */
    private _childMoved(val:any, key:string, snap:FirebaseDataSnapshot, prevChildKey:any) {
        var pos = FirebaseArray._getPositionFor(key, this._list);
        if (pos > -1) {
            var data = this._list.splice(pos, 1)[0];
            var newPos = FirebaseArray._getPositionAfter(prevChildKey, this._list);
            this._list.splice(newPos, 0, data);
            this._emit();
        }
    }

    /**
     * @param child
     * @private
     */
    private _childChanged(val:any, key:string) {
        var pos = FirebaseArray._getPositionFor(key, this._list);
        if (pos > -1) {
            this._list[pos] = {
                value: val,
                id: key
            };
            this._emit();
        }
    }
}