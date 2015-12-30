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
    /**
     * Wraps the given Firebase event type as an observable.
     * @param eventType {string} One of the following strings: "value", "child_added", "child_changed", "child_removed", or "child_moved."
     */
    FirebaseService.prototype.wrapFirebaseEvent = function (eventType) {
        return firebase_utils_1.FirebaseUtils.wrapFirebaseEvent(this.firebase, eventType);
    };
    /**
     * Retrieves an observable that wraps the given event from the Firebase API.
     * @param eventType {string} One of the following strings: "value", "child_added", "child_changed", "child_removed", or "child_moved."
     * @returns {Observable<FirebaseDataSnapshot>} An object that represents the asynchronous stream of events.
     */
    FirebaseService.prototype.on = function (eventType) {
        return this.wrapFirebaseEvent(eventType);
    };
    Object.defineProperty(FirebaseService.prototype, "valueRaw", {
        /**
         * Gets the raw event stream for the 'value' event from the underlying Firebase Object.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.wrapFirebaseEvent('value');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseService.prototype, "value", {
        /**
         * Gets an observable that resolves with the value in this Firebase location and whenever the data is updated.
         * Internally, this maps to the 'value' event emitted by Firebase.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.valueRaw.map(function (data) { return data.val(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseService.prototype, "dataRaw", {
        /**
         * Alias for .valueRaw.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.valueRaw;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseService.prototype, "data", {
        /**
         * Gets an observable that resolves with the data in this Firebase location and whenever the data is updated.
         * Semantically the same as calling .value.
         * Internally, this maps to the 'value' event emitted by Firebase.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseService.prototype, "childAddedRaw", {
        /**
         * Gets the raw event stream for the 'child_added' event from the underlying Firebase Object.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.wrapFirebaseEvent('child_added');
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
            return this.childAddedRaw.map(function (data) { return data.val(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseService.prototype, "childChangedRaw", {
        /**
         * Gets the raw event stream for the 'child_changed' event from the underlying Firebase Object.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.wrapFirebaseEvent('child_changed');
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
            return this.childChangedRaw.map(function (data) { return data.val(); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FirebaseService.prototype, "childRemovedRaw", {
        /**
         * Gets the raw event stream for the 'child_removed' event from the underlying Firebase Object.
         * @returns {Observable<any>}
         */
        get: function () {
            return this.wrapFirebaseEvent('child_removed');
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
            return this.childRemovedRaw.map(function (data) { return data.val(); });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the data exact data that this Firebase location should contain and
     * returns an observable that represents the operation.
     * @param data The data that should be set to this location.
     * @returns {Promise<boolean>} Returns a promise that resolves `true` if the data was set. Otherwise the promise rejects if there was an error.
     */
    FirebaseService.prototype.setData = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.firebase.set(data, function (err) {
                if (err !== null) {
                    reject(err);
                }
                else {
                    resolve(true);
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
        __metadata('design:paramtypes', [Object])
    ], FirebaseService);
    return FirebaseService;
})();
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=firebase.service.js.map