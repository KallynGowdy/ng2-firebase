/// <reference path="../typings/sinon/sinon.d.ts"/>
import {FirebaseSpec} from './firebase.spec';

interface Spec {
    register();
}

var specs : Spec[] = [
    FirebaseSpec
];

for(var i = 0; i < specs.length; i++){
    specs[i].register();
}