/// <
import {Injectable} from 'angular2/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {FirebaseConfig} from "./firebase.config";
import {FirebaseUtils} from "./firebase-utils";
import {FirebaseArray} from "./firebase-array";

/**
 * Defines a service that wraps the Firebase Javascript API in a nice, Observable-enabled manner.
 *
 * **Example**:
 *
 * ```TypeScript
 * import {FirebaseService} from 'firebase-angular2/core';
 *
 * // Tell TypeScript that the Firebase SDK has created a global for us
 * declare var Firebase;
 *
 * var firebase = new FirebaseService(
 *    new Firebase('https://YOUR-FIREBASE-URL.firebaseio-demo.com')
 * );
 *
 * // Use Service
 * ```
 *
 * **Angular 2 Example:**
 * ```
 * // some.component.ts
 * import { Component, OnInit, provide } from 'angular2/core';
 * import { FirebaseService, FirebaseServiceFactory } from 'firebase-angular2/core';
 * import { Observable } from 'rxjs/Rx';
 *
 * @@Component({
 *    // FirebaseServiceFactory is not Implemented yet...
 *    selector: 'some-component',
 *
 *    // Make sure to include the async pipe so that the most recent value
 *    // is resolved from the data observable.
 *    template: 'My Data: {{data | async}}',
 *
 *    // Declare the providers that should be used for the service.
 *    providers: [
 *      provide(FirebaseService, { useFactory: FirebaseServiceFactory })
 *    ]
 * })
 * export class SomeComponent implements OnInit {
 *   private firebase: FirebaseService;
 *   data: Observable<any>;
 *
 *   constructor(firebase: FirebaseService) {
 *      this.firebase = firebase;
 *   }
 *
 *   observeData() {
 *      this.data = this.firebase.data;
 *   }
 *
 *   ngOnInit() {
 *      this.observeData();
 *   }
 * }
 * ```
 */
@Injectable()
export class FirebaseService {
    /**
     * Gets the internal Firebase Instance.
     * @returns {Firebase}
     */
    get firebase():Firebase {
        return this._firebase;
    }

    private _firebase:Firebase;

    /**
     * Wraps the given Firebase event type as an observable.
     * @param eventType {string} One of the following strings: "value", "child_added", "child_changed", "child_removed", or "child_moved."
     */
    private wrapFirebaseEvent(eventType:string):Observable<any[]> {
        return FirebaseUtils.wrapFirebaseEvent(this.firebase, eventType);
    }

    /**
     * Retrieves an observable that wraps the given event from the Firebase API.
     * @param eventType {string} One of the following strings: "value", "child_added", "child_changed", "child_removed", or "child_moved."
     * @returns {Observable<FirebaseDataSnapshot>} An object that represents the asynchronous stream of events.
     */
    public on(eventType:string):Observable<any[]> {
        return this.wrapFirebaseEvent(eventType);
    }

    /**
     * Gets the raw event stream for the 'value' event from the underlying Firebase Object.
     * @returns {Observable<any>}
     */
    get valueRaw():Observable<any[]> {
        return this.wrapFirebaseEvent('value');
    }

    /**
     * Gets an observable that resolves with the value in this Firebase location and whenever the data is updated.
     * Internally, this maps to the 'value' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get value():Observable<any> {
        return this.valueRaw.map((data) => data[0].val());
    }

    /**
     * Alias for .valueRaw.
     * @returns {Observable<any>}
     */
    get dataRaw():Observable<any[]> {
        return this.valueRaw;
    }

    /**
     * Gets an observable that resolves with the data in this Firebase location and whenever the data is updated.
     * Semantically the same as calling .value.
     * Internally, this maps to the 'value' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get data():Observable<any> {
        return this.value;
    }

    /**
     * Gets the raw event stream for the 'child_added' event from the underlying Firebase Object.
     * @returns {Observable<any>}
     */
    get childAddedRaw():Observable<any[]> {
        return this.wrapFirebaseEvent('child_added');
    }

    /**
     * Gets an observable that resolves whenever a child is added to this Firebase location.
     * Internally, this maps to the 'child_added' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childAdded():Observable<any> {
        return this.childAddedRaw.map((data) => data[0].val());
    }

    /**
     * Gets the raw event stream for the 'child_changed' event from the underlying Firebase Object.
     * @returns {Observable<any>}
     */
    get childChangedRaw():Observable<any[]> {
        return this.wrapFirebaseEvent('child_changed');
    }

    /**
     * Gets an observable that resolves whenever the data of a child in this Firebase location is modified.
     * Internally, this maps to the 'child_changed' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childChanged():Observable<any> {
        return this.childChangedRaw.map(data => data[0].val());
    }

    /**
     * Gets the raw event stream for the 'child_removed' event from the underlying Firebase Object.
     * @returns {Observable<any>}
     */
    get childRemovedRaw():Observable<any[]> {
        return this.wrapFirebaseEvent('child_removed');
    }

    /**
     * Gets an observable that resolves whenever a child is removed from this Firebase location.
     * Internally, this maps to the 'child_removed' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childRemoved():Observable<any> {
        return this.childRemovedRaw.map(data => data[0].val());
    }

    /**
     * Gets an observable that resolves whenever a child is moved in this Firebase location.
     * Internally, this maps to the 'child_moved' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childMoved():Observable<any> {
        return this.childMovedRaw.map(data => data[0].val());
    }

    /**
     * Gets the raw event stream for the 'child_moved' event from the underlying Firebase Object.
     * @returns {Observable<any>}
     */
    get childMovedRaw():Observable<any[]> {
        return this.wrapFirebaseEvent('child_moved');
    }

    /**
     * Sets the data exact data that this Firebase location should contain and
     * returns an observable that represents the operation.
     * @param data The data that should be set to this location.
     * @returns {Promise<boolean>} Returns a promise that resolves `true` if the data was set. Otherwise the promise rejects if there was an error.
     */
    setData(data:any):Promise<boolean> {
        return FirebaseUtils.wrapFirebaseAsyncCall(this.firebase, this.firebase.set, [data]).then(() => true);
    }

    /**
     * @alias setData(data)
     */
    set(data:any):Promise<boolean> {
        return this.setData(data);
    }

    /**
     * Adds the given data to this Firebase location.
     * @param data The data that should be added.
     * @returns {Promise<boolean>}
     */
    push(data:any):Promise<boolean> {
        return FirebaseUtils.wrapFirebaseAsyncCall(this.firebase, this.firebase.push, [data]).then(() => true);
    }

    /**
     * Removes the child with the given key from this location.
     * If a key is not provided, then this location will be removed from it's parent location.
     * @param key The key of the child that should be removed from this location.
     * @returns {Promise<boolean>}
     */
    remove(key?:string):Promise<boolean> {
        var firebase = this.firebase;
        if (key) {
            firebase = firebase.child(key);
        }

        return FirebaseUtils.wrapFirebaseAsyncCall(firebase, this.firebase.remove, []).then(() => true);
    }

    /**
     * Wraps this FirebaseService in a new FirebaseArray object.
     * The FirebaseArray service provides functionality for dealing with synchronized order lists of objects.
     * @returns {FirebaseArray}
     */
    asArray():FirebaseArray {
        return new FirebaseArray(this);
    }

    /**
     * Creates a new FirebaseService using the given Firebase JavaScript API Object.
     * @param firebase The Object that represents the instantiated Firebase JavaScript API Object.
     */
    constructor(firebase:any) {
        this._firebase = firebase;
    }

    /**
     * Gets a child Firebase service that represents the data at the given path.
     * @param path The relative path from this Firebase location to the requested location.
     * @returns {FirebaseService}
     */
    public child(path:string):FirebaseService {
        return new FirebaseService(this.firebase.child(path));
    }
}