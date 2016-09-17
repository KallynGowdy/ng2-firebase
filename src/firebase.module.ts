import {NgModule, ModuleWithProviders} from "@angular/core"
import {FirebaseService} from "./firebase.service";
import {FirebaseConfig} from "./firebase.config";

/**
 * Defines a class that represents the main ng2-firebase module.
 * Use the `forRoot` function to provide a `FirebaseConfig` with your application settings.
 */
@NgModule({
    providers: [FirebaseService]
})
export class FirebaseModule {

    /**
     * Returns a `ModuleWithProviders` that configures the `FirebaseModule` with the given config object.
     * Generally, when importing the `FirebaseModule` into your application, you will want to call this function with your `FirebaseConfig`.
     * @param config The configuration that should be used to connect to Firebase.
     * @returns {{ngModule: FirebaseModule, providers: {provide: FirebaseConfig, useValue: FirebaseConfig}}}
     */
    static forRoot(config: FirebaseConfig): ModuleWithProviders {
        return {
            ngModule: FirebaseModule,
            providers: [
                {provide: FirebaseConfig, useValue: config}
            ]
        }
    }

}