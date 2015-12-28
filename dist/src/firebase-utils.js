var Rx_1 = require('rxjs/Rx');
/**
 * A class that defines utility functions that help Wrap the Firebase JavaScript API.
 */
var FirebaseUtils = (function () {
    function FirebaseUtils() {
    }
    /**
     * Wraps the given Firebase call in an Observable.
     * When the async call returns, the Observable resolves with the callback
     * arguments.
     * @param obj The object that the given function should be called on.
     * @param fn The function that should be wrapped.
     * @param args The Arguments that should be given to Firebase.
     * @returns {Observable<any>}
     */
    FirebaseUtils.wrapFirebaseAsyncCall = function (obj, fn, args) {
        args = args.slice();
        return Rx_1.Observable.create(function (observer) {
            args.push(callback);
            function callback(err) {
                if (err !== null) {
                    observer.error(err);
                }
                else {
                    observer.next(Array.prototype.slice.call(arguments));
                    observer.complete();
                }
            }
            fn.apply(obj, args);
        });
    };
    /**
     * Gets an observable that represents the given event name for the internal Firebase instance.
     * Whenever the event is triggered by the internal Firebase instance, the Observable will resolve with the new data.
     * This function is useful to map Firebase events to Observables.
     * When the observable is disposed, the event listener is removed.
     * @param firebase The Raw Firebase JavaScript API Object.
     * @param eventName The name of the event that should be listened to.
     * @returns {Observable<any>}
     */
    FirebaseUtils.wrapFirebaseEvent = function (firebase, eventName) {
        return Rx_1.Observable.create(function (observer) {
            var callback = function (data) {
                observer.onNext(data);
            };
            firebase.on(eventName, callback, function (err) {
                observer.onError(err);
            });
            return function () {
                firebase.off(eventName, callback);
            };
        });
    };
    return FirebaseUtils;
})();
exports.FirebaseUtils = FirebaseUtils;
//# sourceMappingURL=firebase-utils.js.map