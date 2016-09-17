import {Injectable} from '@angular/core';
declare var firebase:FirebaseStatic;

/**
 * Defines an object that represents configuration for a FirebaseService.
 */
@Injectable()
export class FirebaseConfig {

    /**
     * The database URL that the app should use to connect to Firebase.
     * Typically in the format `https://<YOUR-FIREBASE-APP>.firebaseio.com`.
     * @alias url
     * @returns {string}
     */
    public databaseURL: string;

    /**
     * The API Key that your application should use to connect to your Firebase app.
     */
    public apiKey: string;

    /**
     * The domain that your application should connect to for authorization.
     * Typically in the format `https://<YOUR-PROJECT-ID>.firebaseapp.com`
     */
    public authDomain: string;

    /**
     * Creates a new FirebaseConfig object using the given Firebase URL.
     * @param databaseURL The URL that should be used to connect to the Firebase realtime database.
     * @param apiKey The API Key that should be used to connect to Firebase.
     * @param authDomain The domain that should be used for Auth.
     */
    constructor(databaseURL:string, apiKey: string, authDomain: string) {
        this.databaseURL = databaseURL;
        this.apiKey = apiKey;
        this.authDomain = authDomain;
    }
}