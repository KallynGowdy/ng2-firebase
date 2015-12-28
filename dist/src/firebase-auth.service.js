var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var firebase_service_1 = require("./firebase.service");
var firebase_utils_1 = require('./firebase-utils');
/**
 * Defines a Firebase Service that provides Auth & Auth features.
 */
var FirebaseAuthService = (function () {
    /**
     * Initializes a new FirebaseAuthService using the given FirebaseService.
     * @param firebase
     */
    function FirebaseAuthService(firebase) {
        this._firebase = firebase;
    }
    Object.defineProperty(FirebaseAuthService.prototype, "service", {
        /**
         * Gets the FirebaseService that this Auth service is using.
         * @returns {FirebaseService}
         */
        get: function () {
            return this._firebase;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseAuthService.prototype, "firebase", {
        /**
         * Gets the internal Firebase JavaScript API Service.
         * @returns {Firebase}
         */
        get: function () {
            return this.service.firebase;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Authenticates the Firebase client using email & password credentials.
     * This will start a session that is connected to the FirebaseService.
     * @param credentials
     */
    FirebaseAuthService.prototype.authWithPassword = function (credentials) {
        return firebase_utils_1.FirebaseUtils.wrapFirebaseAsyncCall(this.firebase, this.firebase.authWithPassword, [credentials])
            .map(function (args) { return args[1]; });
    };
    FirebaseAuthService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [firebase_service_1.FirebaseService])
    ], FirebaseAuthService);
    return FirebaseAuthService;
})();
exports.FirebaseAuthService = FirebaseAuthService;
//# sourceMappingURL=firebase-auth.service.js.map