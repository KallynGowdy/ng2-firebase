import {Injectable} from "angular2/core";
import {FirebaseService} from './firebase.service';
import {Observable} from "rxjs/Rx";
import {Subject} from "rxjs/Subject";

/**
 * Defines a class that provides capabilities to synchronize ordered lists for a Firebase Object.
 */
@Injectable()
export class FirebaseArray extends Subject<any[]> {
    private service:FirebaseService;
    private list:any[];

    /**
     * Creates a new FirebaseArray using the given FirebaseService.
     * @param firebaseService
     */
    constructor(firebaseService:FirebaseService) {
        super();
        this.service = firebaseService;
        this.list = [];
        this._init();
    }

    /**
     * @private
     */
    _init() {
        this._subscribeToEvent(this.service.childAddedRaw, this._childAdded);
        this._subscribeToEvent(this.service.childRemovedRaw, this._childRemoved);
        this._subscribeToEvent(this.service.childChangedRaw, this._childChanged);
        this._subscribeToEvent(this.service.childMovedRaw, this._childMoved);
    }

    _subscribeToEvent(observable:Observable<FirebaseDataSnapshot>, reciever:(val:any, key:string) => void) {
        observable.subscribe(this._wrap(reciever), this.error, this.complete);
    }

    _wrap(func:(val:any, key:string) => void) {
        return (child:FirebaseDataSnapshot) => {
            func(child.val(), child.key(), ...arguments);
        }
    }

    _getPositionFor(key) {
        for (var i = 0; i < this.list.length; i++) {
            var v = this.list[i];
            if (v.$id === key) {
                return i;
            }
        }
        return -1;
    }

    _getPositionAfter(prevChildKey) {
        if (prevChildKey === null) {
            return 0;
        }
        else {
            var i = this._getPositionFor(prevChildKey);
            if (i === -1) {
                return this.list.length;
            }
            else {
                return i + 1;
            }
        }
    }

    /**
     * @param child
     * @private
     */
    _childAdded(val:any, key:string, snap:FirebaseDataSnapshot, prevChild:any) {
        val.$id = key;
        var pos = this._getPositionAfter(prevChild);
        this.list.splice(pos, 0, val);
    }

    /**
     *
     * @param child
     * @private
     */
    _childRemoved(val:any, key:string) {

    }

    /**
     * @param child
     * @private
     */
    _childMoved(val:any, key:string) {

    }

    /**
     * @param child
     * @private
     */
    _childChanged(val:any, key:string) {

    }
}