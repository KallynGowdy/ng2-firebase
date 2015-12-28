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
var Rx_1 = require('rxjs/Rx');
var firebase_utils_1 = require("./firebase-utils");
/**
 * Defines a service that wraps the Firebase Javascript API in a nice, Observable-enabled manner.
 */
var FirebaseService = (function () {
    /**
     * Creates a new FirebaseService using the given Firebase JavaScript API Object.
     * @param firebase The Object that represents the instantiated Firebase JavaScript API Object.
     */
    function FirebaseService(firebase) {
        this._firebase = firebase;
    }
    Object.defineProperty(FirebaseService.prototype, "firebase", {
        /**
         * Gets the internal Firebase Instance.
         * @returns {Firebase}
         */
        get: function () {
            return this._firebase;
        },
        enumerable: true,
        configurable: true
    });
    FirebaseService.prototype.wrapFirebaseEvent = function (eventName) {
        return firebase_utils_1.FirebaseUtils.wrapFirebaseEvent(this.firebase, eventName);
    };
    Object.defineProperty(FirebaseService.prototype, "data", {
        /**
         * Gets an observable that resolves with the data in this Firebase location and whenever the data is updated.
         * Internally, this maps to the 'value' event emitted by Firebase.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.wrapFirebaseEvent('value').map(function (data) { return data.val(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseService.prototype, "childAdded", {
        /**
         * Gets an observable that resolves whenever a child is added to this Firebase location.
         * Internally, this maps to the 'child_added' event emitted by Firebase.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.wrapFirebaseEvent('child_added').map(function (data) { return data.val(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseService.prototype, "childChanged", {
        /**
         * Gets an observable that resolves whenever the data of a child in this Firebase location is modified.
         * Internally, this maps to the 'child_changed' event emitted by Firebase.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.wrapFirebaseEvent('child_changed').map(function (data) { return data.val(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseService.prototype, "childRemoved", {
        /**
         * Gets an observable that resolves whenever a child is removed from this Firebase location.
         * Internally, this maps to the 'child_removed' event emitted by Firebase.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.wrapFirebaseEvent('child_removed').map(function (data) { return data.val(); });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the data exact data that this Firebase location should contain and
     * returns an observable that represents the operation.
     * @param data The data that should be set to this location.
     * @returns {Observable<any>}
     */
    FirebaseService.prototype.setData = function (data) {
        var _this = this;
        return Rx_1.Observable.create(function (observer) {
            _this.firebase.set(data, function (err) {
                if (err !== null) {
                    observer.onError(err);
                }
                else {
                    observer.onCompleted();
                }
            });
        });
    };
    /**
     * Gets a child Firebase service that represents the data at the given path.
     * @param path The relative path from this Firebase location to the requested location.
     * @returns {FirebaseService}
     */
    FirebaseService.prototype.child = function (path) {
        return new FirebaseService(this.firebase.child(path));
    };
    FirebaseService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [Firebase])
    ], FirebaseService);
    return FirebaseService;
})();
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=firebase.service.js.map