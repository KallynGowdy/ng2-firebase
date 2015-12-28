import {Injectable} from 'angular2/core';
import {FirebaseService} from "./firebase.service";
declare var Firebase:FirebaseStatic;

/**
 * Defines an object that represents configuration for a FirebaseService.
 */
@Injectable()
export class FirebaseConfig {
    /**
     * The URL that the service should use to connect to firebase.
     * Typically in the format "https://<YOUR-FIREBASE-APP>.firebaseio.com"
     */
    public url:string;

    constructor(url:string) {
        this.url = url;
    }

    /**
     * Creates a new Firebase JavaScript API Object from this configuration.
     * @returns {Firebase}
     */
    public createFirebase():Firebase {
        return new Firebase(this.url);
    }

    /**
     * Creates a new Firebase Service using the this configuration.
     */
    public createService():FirebaseService {
        return new FirebaseService(this.createFirebase());
    }
}