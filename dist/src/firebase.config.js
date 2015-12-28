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
/**
 * Defines an object that represents configuration for a FirebaseService.
 */
var FirebaseConfig = (function () {
    function FirebaseConfig(url) {
        this.url = url;
    }
    /**
     * Creates a new Firebase JavaScript API Object from this configuration.
     * @returns {Firebase}
     */
    FirebaseConfig.prototype.createFirebase = function () {
        return new Firebase(this.url);
    };
    /**
     * Creates a new Firebase Service using the this configuration.
     */
    FirebaseConfig.prototype.createService = function () {
        return new firebase_service_1.FirebaseService(this.createFirebase());
    };
    FirebaseConfig = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [String])
    ], FirebaseConfig);
    return FirebaseConfig;
})();
exports.FirebaseConfig = FirebaseConfig;
//# sourceMappingURL=firebase.config.js.map