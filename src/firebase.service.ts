import {Injectable} from 'angular2/core';
import * as FirebaseType from 'firebase';
import {FirebaseConfig} from "./firebase.config";
import {Observable} from 'rxjs/Rx';
import {FirebaseUtils} from "./firebase-utils";
declare var Firebase:FirebaseStatic;

/**
 * Defines a service that wraps the Firebase Javascript API in a nice, Observable-enabled manner.
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

    private wrapFirebaseEvent(eventName: string):Observable<any>{
        return FirebaseUtils.wrapFirebaseEvent(this.firebase, eventName);
    }

    /**
     * Gets an observable that resolves with the data in this Firebase location and whenever the data is updated.
     * Internally, this maps to the 'value' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get data():Observable<any> {
        return this.wrapFirebaseEvent('value').map((data) => data.val());
    }

    /**
     * Gets an observable that resolves whenever a child is added to this Firebase location.
     * Internally, this maps to the 'child_added' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childAdded():Observable<any> {
        return this.wrapFirebaseEvent('child_added').map((data) => data.val());
    }

    /**
     * Gets an observable that resolves whenever the data of a child in this Firebase location is modified.
     * Internally, this maps to the 'child_changed' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childChanged():Observable<any> {
        return this.wrapFirebaseEvent('child_changed').map(data => data.val());
    }

    /**
     * Gets an observable that resolves whenever a child is removed from this Firebase location.
     * Internally, this maps to the 'child_removed' event emitted by Firebase.
     * @returns {Observable<any>}
     */
    get childRemoved():Observable<any> {
        return this.wrapFirebaseEvent('child_removed').map(data => data.val());
    }

    /**
     * Sets the data exact data that this Firebase location should contain and
     * returns an observable that represents the operation.
     * @param data The data that should be set to this location.
     * @returns {Observable<any>}
     */
    setData(data:any):Observable<any> {
        return Observable.create((observer) => {
            this.firebase.set(data, (err) => {
                if (err !== null) {
                    observer.onError(err);
                } else {
                    observer.onCompleted();
                }
            });
        });
    }

    /**
     * Creates a new FirebaseService using the given Firebase JavaScript API Object.
     * @param firebase The Object that represents the instantiated Firebase JavaScript API Object.
     */
    constructor(firebase:Firebase) {
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