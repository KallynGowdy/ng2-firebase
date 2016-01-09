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

    add(data:any) {
        return this._service.push(data);
    }

    remove(index:(string|number)) {
        return this._service.remove(index.toString());
    }

    set(index:(string|number), data:any) {
        if (data.hasOwnProperty('$id')) {
            delete data.$id
        }
        return this._service.child(index.toString()).set(data);
    }

    indexOf(index:(string|number)) {
        return this._getPositionFor(index.toString());
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
    private _wrap(func:(val:any, key:string) => void) {
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
        this.next(this._list.slice());
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