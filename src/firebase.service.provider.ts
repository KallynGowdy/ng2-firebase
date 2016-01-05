import {provide} from 'angular2/core';
import {FirebaseService} from './firebase.service';
import {FirebaseServiceFactory} from './firebase.service.factory';

/**
 * Gets the default Provider for FirebaseService services.
 * Semantically, using this variable is equivalent to the following statements:
 *
 * ```TypeScript
 * import {FirebaseService, FirebaseServiceFactory} from 'firebase-angular2/core';
 * var provider = provide(FirebaseService, {useFactory: FirebaseServiceFactory})
 * ```
 *
 * @type {Provider}
 */
export var FirebaseServiceProvider = provide(FirebaseService, {
    useFactory: FirebaseServiceFactory,
    deps: ['Firebase']
});