import {Observable} from 'rxjs/Rx';
declare var Firebase:FirebaseStatic;

/**
 * A class that defines utility functions that help Wrap the Firebase JavaScript API.
 */
export class FirebaseUtils {

    /**
     * Wraps the given Firebase call in a Promise.
     * When the async call returns, the Promise resolves with the callback
     * arguments in an array.
     * @param obj The object that the given function should be called on. This is typically your Firebase ref instance.
     * @param fn The function that should be wrapped.
     * @param args The Arguments that should be given to Firebase.
     * @returns {Promise<any[]>}
     */
    public static wrapFirebaseAsyncCall(obj:any, fn:Function, args:any[] = []):Promise<any[]> {
        args = args.slice();
        return new Promise((resolve, reject) => {
            args.push(callback);
            function callback(err) {
                if (err !== null) {
                    reject(err);
                }
                else {
                    resolve(Array.prototype.slice.call(arguments));
                }
            }
            fn.apply(obj, args);
        });
    }

    /**
     * Gets an observable that represents the given event name for the internal Firebase instance.
     * Whenever the event is triggered by the internal Firebase instance, the Observable will resolve with the new data.
     * This function is useful to map Firebase events to Observables.
     * When the observable is disposed, the event listener is removed.
     * @param firebase The Raw Firebase JavaScript API Object.
     * @param eventName The name of the event that should be listened to.
     * @returns {Observable<any>}
     */
    public static wrapFirebaseEvent(firebase:Firebase, eventName:string):Observable<any[]> {
        return Observable.create((observer) => {
            var callback = function () {
                observer.next(Array.prototype.slice.call(arguments));
            };
            firebase.on(eventName,
                callback,
                (err) => {
                    observer.error(err);
                });

            return () => {
                firebase.off(eventName, callback);
            };
        });
    }
}