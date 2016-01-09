import {Injectable} from "angular2/core";
import {FirebaseService} from './firebase.service';
import {Observable} from "rxjs/Rx";
import {Subject} from "rxjs/Subject";

/**
 * Defines a class that provides capabilities to synchronize ordered lists for a Firebase Object.
 */
@Injectable()
export class FirebaseArray extends Subject<any[]> {
    private _service:FirebaseService;
    private _list:any[];

    /**
     * @type {boolean}
     * @private
     */
    private _initialized:boolean = false;

    /**
     * Creates a new FirebaseArray using the given FirebaseService.
     * @param firebaseService
     */
    constructor(firebaseService:FirebaseService) {
        super();
        this._service = firebaseService;
        this._list = [];
        this._init();
    }

    /**
     * Adds the given data to the end of this array.
     * Returns a promise that represents the async operation.
     * @param data The data that should be added to the data structure.
     * @returns {Promise<boolean>}
     */
    add(data:any):Promise<boolean> {
        if (typeof data === 'undefined' || data === null) {
            throw new Error(
                'Cannot add nulls to synchronized array as they cannot be reliably tracked. ' +
                'If you want a "null"-like value, use a special trigger value, such as a custom Unit or Void object.');
        }
        return this._service.push(data);
    }

    /**
     * Removes the child at the given index(a.k.a. key) from this array.
     * @param index The key of the child that should be removed from the data structure.
     * @returns {Promise<boolean>}
     */
    remove(index:(string|number)):Promise<boolean> {
        if (index === null) {
            throw new Error('The provided index is invalid. Please make sure that it is in the range of 0 - array.length');
        }
        return this._service.remove(index.toString());
    }

    /**
     * Sets the data stored at the given index (a.k.a. key).
     * @param index The key of the child whose data should be replaced.
     * @param data The data that the child should be replaced with.
     * @returns {Promise<boolean>}
     */
    set(index:(string|number), data:any):Promise<boolean> {
        if (data.hasOwnProperty('$id')) {
            delete data.$id
        }
        return this._service.child(index.toString()).set(data);
    }

    /**
     * Gets the of the member with the given key.
     * @param key
     * @returns {number|number}
     */
    indexOf(key:(string|number)) {
        return this._getPositionFor(key.toString());
    }

    /**
     * Gets the underlying service for this array.
     * @returns {FirebaseService}
     */
    get service():FirebaseService {
        return this._service;
    }

    /**
     * Gets the current length of the array.
     * @returns {number}
     */
    get length():number {
        return this._list.length;
    }

    get array():any[] {
        return this._list.slice();
    }

    /**
     * Gets an observable for the length of the array.
     * @returns {Observable<number>}
     */
    get lengthObservable():Observable<number> {
        return this.map((a) => a.length).distinctUntilChanged();
    }

    /**
     * @private
     */
    private _init() {
        if (!this._initialized) {
            this._subscribeToEvent(this._service.childAddedRaw, this._childAdded.bind(this));
            this._subscribeToEvent(this._service.childRemovedRaw, this._childRemoved.bind(this));
            this._subscribeToEvent(this._service.childChangedRaw, this._childChanged.bind(this));
            this._subscribeToEvent(this._service.childMovedRaw, this._childMoved.bind(this));
            this._initialized = true;
        }
    }

    /**
     * @param observable
     * @param reciever
     * @private
     */
    private _subscribeToEvent(observable:Observable<any[]>, reciever:Function) {
        observable.subscribe(this._wrap(reciever), this.error, this.complete);
    }

    /**
     * @param func
     * @returns {function(any[]): undefined}
     * @private
     */
    private _wrap(func:Function) {
        return (args:any[]) => {
            var child:FirebaseDataSnapshot = args[0];
            func(child.val(), child.key(), ...args);
        }
    }

    /**
     * @param key
     * @returns {number}
     * @private
     */
    private _getPositionFor(key:string) {
        for (var i = 0; i < this._list.length; i++) {
            var v = this._list[i];
            if (v.$id === key) {
                return i;
            }
        }
        return -1;
    }

    /**
     * @param prevChildKey
     * @returns {any}
     * @private
     */
    private _getPositionAfter(prevChildKey:string) {
        if (prevChildKey === null) {
            return 0;
        }
        else {
            var i = this._getPositionFor(prevChildKey);
            if (i === -1) {
                return this._list.length;
            }
            else {
                return i + 1;
            }
        }
    }

    private _emit() {
        this.next(this.array);
    }

    /**
     * @param child
     * @private
     */
    private _childAdded(val:any, key:string, snap:FirebaseDataSnapshot, prevChild:any):void {
        val.$id = key;
        var pos = this._getPositionAfter(prevChild);
        this._list.splice(pos, 0, val);
        this._emit();
    }

    /**
     *
     * @param child
     * @private
     */
    private _childRemoved(val:any, key:string) {
        var pos = this._getPositionFor(key);
        if (pos > -1) {
            this._list.splice(pos, 1);
            this._emit();
        }
    }

    /**
     * @param child
     * @private
     */
    private _childMoved(val:any, key:string, snap:FirebaseDataSnapshot, prevChildKey:any) {
        var pos = this._getPositionFor(key);
        if (pos > -1) {
            var data = this._list.splice(pos, 1)[0];
            var newPos = this._getPositionAfter(prevChildKey);
            this._list.splice(newPos, 0, data);
            this._emit();
        }
    }

    /**
     * @param child
     * @private
     */
    private _childChanged(val:any, key:string) {
        var pos = this._getPositionFor(key);
        if (pos > -1) {
            this._list[pos] = val;
            this._list[pos].$id = key;
            this._emit();
        }
    }
}