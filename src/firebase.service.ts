/// <
import {Injectable, Inject} from '@angular/core';
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
 * import {FirebaseService} from 'ng2-firebase/core';
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
 * import { FirebaseService, FirebaseServiceFactory } from 'ng2-firebase/core';
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
export class FirebaseService<T> {

    private static _initialized: boolean = false;

    /**
     * Gets the internal Firebase Instance.
     * @returns {Firebase}
     */
    get firebase(): Firebase {
        return this._firebase;
    }

    private _firebase: Firebase;

    /**
     * Wraps the given Firebase event type as an observable.
     * @param eventType {string} One of the following strings: "value", "child_added", "child_changed", "child_removed", or "child_moved."
     */
    private wrapFirebaseEvent(eventType: string): Observable<any[]> {
        return FirebaseUtils.wrapFirebaseEvent(this.firebase, eventType);
    }

    /**
     * Retrieves an observable that wraps the given event from the Firebase API.
     * @param eventType {string} One of the following strings: "value", "child_added", "child_changed", "child_removed", or "child_moved."
     * @returns {Observable<FirebaseDataSnapshot>} An object that represents the asynchronous stream of events.
     */
    public on(eventType: string): Observable<any[]> {
        return this.wrapFirebaseEvent(eventType);
    }

    /**
     * Gets the raw event stream for the 'value' event from the underlying Firebase Object.
     * @returns {Observable<any>}
     */
    get valueRaw(): Observable<any[]> {
        return this.wrapFirebaseEvent('value');
    }

    /**
     * Gets an observable that resolves with the value in this Firebase location and whenever the data is updated.
     * Internally, this maps to the 'value' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get value(): Observable<T> {
        return this.valueRaw.map((data) => data[0].val());
    }

    /**
     * Alias for .valueRaw.
     * @returns {Observable<any>}
     */
    get dataRaw(): Observable<any[]> {
        return this.valueRaw;
    }

    /**
     * Gets an observable that resolves with the data in this Firebase location and whenever the data is updated.
     * Semantically the same as calling .value.
     * Internally, this maps to the 'value' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get data(): Observable<T> {
        return this.value;
    }

    /**
     * Gets the raw event stream for the 'child_added' event from the underlying Firebase Object.
     * @returns {Observable<any>}
     */
    get childAddedRaw(): Observable<any[]> {
        return this.wrapFirebaseEvent('child_added');
    }

    /**
     * Gets an observable that resolves whenever a child is added to this Firebase location.
     * Internally, this maps to the 'child_added' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childAdded(): Observable<any> {
        return this.childAddedRaw.map((data) => data[0].val());
    }

    /**
     * Gets the raw event stream for the 'child_changed' event from the underlying Firebase Object.
     * @returns {Observable<any>}
     */
    get childChangedRaw(): Observable<any[]> {
        return this.wrapFirebaseEvent('child_changed');
    }

    /**
     * Gets an observable that resolves whenever the data of a child in this Firebase location is modified.
     * Internally, this maps to the 'child_changed' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childChanged(): Observable<any> {
        return this.childChangedRaw.map(data => data[0].val());
    }

    /**
     * Gets the raw event stream for the 'child_removed' event from the underlying Firebase Object.
     * @returns {Observable<any>}
     */
    get childRemovedRaw(): Observable<any[]> {
        return this.wrapFirebaseEvent('child_removed');
    }

    /**
     * Gets an observable that resolves whenever a child is removed from this Firebase location.
     * Internally, this maps to the 'child_removed' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childRemoved(): Observable<any> {
        return this.childRemovedRaw.map(data => data[0].val());
    }

    /**
     * Gets an observable that resolves whenever a child is moved in this Firebase location.
     * Internally, this maps to the 'child_moved' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childMoved(): Observable<any> {
        return this.childMovedRaw.map(data => data[0].val());
    }

    /**
     * Gets the raw event stream for the 'child_moved' event from the underlying Firebase Object.
     * @returns {Observable<any>}
     */
    get childMovedRaw(): Observable<any[]> {
        return this.wrapFirebaseEvent('child_moved');
    }

    /**
     * Sets the data exact data that this Firebase location should contain and
     * returns an observable that represents the operation.
     * @param data The data that should be set to this location.
     * @returns {Promise<boolean>} Returns a promise that resolves `true` if the data was set. Otherwise the promise rejects if there was an error.
     */
    setData(data: T): Promise<boolean> {
        return FirebaseUtils.wrapFirebaseAsyncCall(this.firebase, this.firebase.set, [data]).then(() => true);
    }

    /**
     * @alias setData(data)
     */
    set(data: T): Promise<boolean> {
        return this.setData(data);
    }

    /**
     * Update the objects children in this Firebase location. Passing null to updateData() will remove the value at the specified location.
     * returns an promise that resolves when the operation is succesfull.
     * @param data The object containing only the keys that should be updated in this location.
     * @returns {Promise<boolean>} Returns a promise that resolves `true` if the data was succesfully updated. Otherwise the promise rejects if there was an error.
     */
    updateData(data: T): Promise<boolean> {
        return FirebaseUtils.wrapFirebaseAsyncCall(this.firebase, this.firebase.update, [data]).then(() => true);
    }

    /**
     * @alias updateData(data)
     */
    update(data: T): Promise<boolean> {
        return this.updateData(data);
    }

    /**
     * Adds the given data to this Firebase location.
     * @param data The data that should be added.
     * @returns {Promise<boolean>}
     */
    push(data: any): Promise<boolean> {
        return FirebaseUtils.wrapFirebaseAsyncCall(this.firebase, this.firebase.push, [data]).then(() => true);
    }

    /**
     * Removes the child with the given key from this location.
     * If a key is not provided, then this location will be removed from it's parent location.
     * @param key The key of the child that should be removed from this location.
     * @returns {Promise<boolean>}
     */
    remove(key?: string): Promise<boolean> {
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
    asArray(): FirebaseArray<T> {
        return new FirebaseArray<T>(<any>this);
    }

    /**
     * Creates a new FirebaseService using the given Firebase JavaScript API Object.
     * @param config Either the FirebaseConfig or Firebase instance that the service should use.
     */
    constructor(@Inject(FirebaseConfig) config: any) {
        if (!config) throw new Error("You must provide either a firebase configuration object or a firebase instance");
        if((<FirebaseConfig>config).databaseURL && config.apiKey && config.databaseURL) {
            this._initalize(config);
            this._firebase = firebase.database().ref();
        } else {
            this._firebase = <Firebase>config;
        }
    }

    private _initalize(config: FirebaseConfig) {
        if(!FirebaseService._initialized) {
            firebase.initializeApp(config);
        }
    }

    /**
     * Gets a child Firebase service that represents the data at the given path.
     * @param path The relative path from this Firebase location to the requested location.
     * @returns {FirebaseService}
     */
    public child<TChild>(path: string): FirebaseService<TChild> {
        return new FirebaseService<TChild>(this.firebase.child(path));
    }
}