import {Injectable} from '@angular/core';
declare var Firebase:FirebaseStatic;

/**
 * Defines an object that represents configuration for a FirebaseService.
 */
@Injectable()
export class FirebaseConfig {
    /**
     * The URL that the service should use to connect to firebase.
     * Typically in the format `https://<YOUR-FIREBASE-APP>.firebaseio.com`
     */
    public url:string;

    /**
     * Creates a new FirebaseConfig object using the given Firebase URL.
     * @param url The URL that should be used to connect to Firebase.
     */
    constructor(url:string) {
        this.url = url;
    }
}