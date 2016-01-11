import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {FirebaseService} from "./firebase.service";
import {FirebaseUtils} from './firebase-utils';
declare var Firebase:FirebaseStatic;

/**
 * Defines a Firebase Service that provides Auth & Auth features.
 */
@Injectable()
export class FirebaseAuthService {
    /**
     * Gets the FirebaseService that this Auth service is using.
     * @returns {FirebaseService}
     */
    get service():FirebaseService {
        return this._firebase;
    }

    /**
     * Gets the internal Firebase JavaScript API Service.
     * @returns {Firebase}
     */
    get firebase():Firebase {
        return this.service.firebase;
    }

    private _firebase:FirebaseService;

    /**
     * Initializes a new FirebaseAuthService using the given FirebaseService.
     * @param firebase
     */
    constructor(firebase:FirebaseService) {
        this._firebase = firebase;
    }

    /**
     * Authenticates the Firebase client using email & password credentials.
     * This will start a session that is connected to the FirebaseService.
     * @param credentials
     */
    authWithPassword(credentials:{email:string, password: string}):Promise<any> {
        return FirebaseUtils.wrapFirebaseAsyncCall(this.firebase, this.firebase.authWithPassword, [credentials])
            .then(args => args[1]);
    }


}