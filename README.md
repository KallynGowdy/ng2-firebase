# ng2-firebase
A rich Angular 2 wrapper library for the Firebase JavaScript SDK.

| `master`  | `all` |
| ------------- | ------------- |
| [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/s/master "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7) | [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/s "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7)  |
| [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/m/master "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7) | [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/m "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7)  |

## Installation


```
npm install --save ng2-firebase
```

## Usage

There are two valid ways to use the library in your project:

 - TypeScript
 - JavaScript (ES5)

### TypeScript - [Demo Application](https://github.com/KallynGowdy/firebase-angular2-demo/tree/master/ts)

To use in your project, reference the `ng2-firebase/core` module:

```TypeScript
// myfile.ts
import {FirebaseModule} from 'ng2-firebase/core';
```

also make sure you include the Firebase JavaScript SDK:

```html
<!-- index.html -->
<script src="https://cdn.firebase.com/js/client/2.3.2/firebase.js"></script>
```

Add the path to your `System.config({})`:

```TypeScript
System.config({
  // ...
  defaultJSExtensions: true,
  map: {
    'ng2-firebase': 'node_modules/ng2-firebase'
  }
});
```

Register the `FirebaseModule` in your root module:

```TypeScript
// app.module.ts
import {NgModule} from '@angular/core';
import {FirebaseModule} from 'ng2-firebase/core';

@NgModule({
    imports: [
        // ... other dependencies
        FirebaseModule.forRoot({ url: 'https://myfirebaseurl.firebase.io' })
        // ... other dependencies
    ]
})
export class AppModule {}
```

Then use it in your component:

```TypeScript
import {FirebaseService} from 'ng2-firebase/core';

@Component({
    selector: 'my-app',
    template: '<h1>My First Angular App!</h1>'
})
export class AppComponent {
    constructor(private firebase: FirebaseService) { }
}
```

### JavaScript - [Demo Application](https://github.com/KallynGowdy/firebase-angular2-demo/tree/master/js)

Make sure that both the Firebase SDK and the Firebase Angular 2 Bundle are included:

```html
<!-- index.html -->
<script src="https://cdn.firebase.com/js/client/2.3.2/firebase.js"></script>
<script src="node_modules/ng2-firebase/bundles/ng2-firebase-all.umd.js"></script>
```

Register the provider:

```JavaScript
// app.module.js
(function (app) {
    app.AppModule =
        ng.core.NgModule({
            imports: [ ng2Firebase.FirebaseModule.forRoot({ url: 'https://myfirebaseurl.firebase.io' }) ]
        })
        .Class({
            constructor: function() {}
        });
})(window.app || (window.app = {}));
```

Use in a component:

```JavaScript
(function(app) {
    app.AppComponent = ng.core
        .Component({
            selector: 'my-app',
            template: '<h1>My First Angular App!</h1>'
        })
        .Class({
            constructor: [ng2Firebase.FirebaseService, function(firebaseService) {
                this.firebaseService = firebaseService;
            }],
        });
})(window.app || (window.app = {}));
```

If you are not using a module system, then all of the exported services and classes from the `ng2-firebase` library are in the `ng2Firebase` global variable.

## Demo

TypeScript and JavaScript implementations of the Angular 2 Tutorial "Tour of Heroes" application have been created at the following repository: [ng2-firebase-demo](https://github.com/KallynGowdy/firebase-angular2-demo).
