import {FirebaseService} from "./firebase.service";
describe("FirebaseService", function(){
    it('has .firebase given in the constructor', function(){
        var obj = <any>{};

        var firebaseService = new FirebaseService(obj);

        expect(firebaseService.firebase).toEqual(obj);
    });
});