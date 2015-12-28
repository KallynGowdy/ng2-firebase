import {FirebaseUtilsSpec} from './firebase-utils.spec';

export var FirebaseSpec = {
    register(){
        describe('Firebase', function () {
            FirebaseUtilsSpec.register();
        });
    }
};