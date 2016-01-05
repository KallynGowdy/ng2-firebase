/// <reference path="../typings/firebase/firebase.d.ts"/>
import {FirebaseService} from './firebase.service';
import {Inject, Injectable} from "angular2/core";

/**
 * Gets the default factory function for FirebaseService objects.
 *
 * Usage:
 *
 * ```TypeScript
 * // Make sure you included the Firebase SDK.
 * import {FirebaseServiceFactory} from 'firebase-angular2/core';
 * var service = FirebaseServiceFactory(Firebase);
 * ```
 *
 * Semantically, using this function is equivalent to the following statements:
 *
 * ```TypeScript
 * // Make sure you included the Firebase SDK.
 * import {FirebaseService} from 'firebase-angular2/core';
 * var firebaseService = new FirebaseService(Firebase);
 * ```
 *
 * @param Firebase
 * @returns {FirebaseService}
 * @constructor
 */
export function FirebaseServiceFactory(Firebase:Firebase):FirebaseService {
    return new FirebaseService(Firebase);
}