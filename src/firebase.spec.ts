import {FirebaseUtilsSpec} from './firebase-utils.spec';
import {FirebaseServiceSpec} from './firebase.service.spec';

export var FirebaseSpec = {
    register(){
        describe('Firebase', function () {
            FirebaseUtilsSpec.register();
            FirebaseServiceSpec.register();
        });
    }
};