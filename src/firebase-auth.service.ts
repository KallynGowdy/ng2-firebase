import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {FirebaseService} from "./firebase.service";
import {FirebaseUtils} from './firebase-utils';
declare var firebase:FirebaseStatic;

/**
 * Defines a Firebase Service that provides Auth & Auth features.
 */
@Injectable()
export class FirebaseAuthService<T> {

    private _auth: any;

    public get auth(): any {
        return this._auth;
    }

    /**
     * Initializes a new FirebaseAuthService using the given FirebaseService.
     * @param firebase
     */
    constructor() {
        this._auth = firebase.auth();
    }

    /**
     * Authenticates the Firebase client using email & password credentials.
     * This will start a session that is connected to the FirebaseService.
     * @param credentials
     */
    authWithPassword(credentials:{email:string, password: string}):Promise<any> {
        return this.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
    }

}