import {NgModule, ModuleWithProviders} from "@angular/core"
import {FirebaseService} from "./firebase.service";
import {FirebaseConfig} from "./firebase.config";

@NgModule({
    providers: [FirebaseService]
})
export class AppModule {

    static forRoot(config: FirebaseConfig): ModuleWithProviders {
        return {
            ngModule: AppModule,
            providers: [
                {provide: FirebaseConfig, useValue: config}
            ]
        }
    }

}