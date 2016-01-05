import {provide} from 'angular2/core';
declare var Firebase:Firebase;

if (typeof Firebase === 'undefined') {
    console.warn('"Firebase" is either not defined or is null. Please make sure that you are including the Firebase SDK script before loading this or related angular2-firebase scripts.');
}

/**
 * Declares a basic provider for the Global Firebase API object that is loaded by the Firebase JavaScript SDK.
 *
 * Usage:
 *
 * ```TypeScript
 * import {FirebaseProvider} from 'firebase-angular2/core';
 *
 * // Later in the application when you are declaring the providers...
 *
 * bootstrap(MyAppComponent, [FirebaseProvider, MyOtherProvider]);
 * ```
 *
 * @type {Provider}
 */
export var FirebaseProvider = provide('Firebase', {
    useFactory: () => {
        if (Firebase === undefined || Firebase === null) {
            console.error('"Firebase" is either not defined or is null. Please make sure that you are including the Firebase SDK script before loading this or related angular2-firebase scripts.');
        }
        return Firebase;
    }
});