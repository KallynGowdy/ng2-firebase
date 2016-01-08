# firebase-angular2
A rich Angular 2 wrapper library for the Firebase JavaScript SDK.

| `master`  | `all` |
| ------------- | ------------- |
| [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/s/master "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7) | [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/s "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7)  |
| [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/m/master "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7) | [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/m "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7)  |

## Installation


```
npm install --save firebase-angular2
```

## Usage

There are two valid ways to use the library in your project:

 - TypeScript
 - JavaScript (ES5)

### TypeScript - [Demo Application](https://github.com/KallynGowdy/firebase-angular2-demo/tree/master/ts)

To use in your project, reference the `firebase-angular2/core` module:

```TypeScript
// myfile.ts
import {FirebaseService} from 'firebase-angular2/core';
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
    'firebase-angular2': 'node_modules/firebase-angular2'
  }
});
```

Finally, register whatever providers you need:

```TypeScript
// boot.ts
import {provide} from 'angular2/core';
import {FirebaseService} from 'firebase-angular2/core';

// Tell TypeScript that Firebase is a global object.
declare var Firebase;

bootstrap(MyAppComponent, [
    provide(FirebaseService, {useFactory: () => new new FirebaseService(new Firebase('https://YOUR-FIREBASE-URL.firebaseio.com/')))})
]);
```

### JavaScript - [Demo Application](https://github.com/KallynGowdy/firebase-angular2-demo/tree/master/js)

Make sure that both the Firebase SDK and the Firebase Angular 2 Bundle are included:

```html
<!-- index.html -->
<script src="https://cdn.firebase.com/js/client/2.3.2/firebase.js"></script>
<script src="node_modules/firebase-angular2/bundles/firebase-angular2-all.umd.js"></script>
```

Register the provider:

```JavaScript
// boot.js
(function (app) {
    document.addEventListener('DOMContentLoaded', function () {
        ng.platform.browser.bootstrap(app.AppComponent, [
            // TODO: Improve Injection to be modular
            //       For some reason, the modular versions break the app
            ng.core.provide(
                firebaseAngular2.FirebaseService,
                {
                    useFactory: function () {
                        new firebaseAngular2.FirebaseService(
                            new Firebase('https://fb-angular2-demo.firebaseio.com/')
                        )
                    }
                })
        ]);
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
            constructor: [firebaseAngular2.FirebaseService, function(firebaseService) {
                this.firebaseService = firebaseService;
            }],
        });
})(window.app || (window.app = {}));
```

If you are not using a module system, then all of the exported services and classes from the `firebase-angular2` library are in the `firebaseAngular2` global variable.

## Demo

TypeScript and JavaScript implementations of the Angular 2 Tutorial "Tour of Heroes" application have been created at the following repository: [firebase-angular2-demo](https://github.com/KallynGowdy/firebase-angular2-demo).
