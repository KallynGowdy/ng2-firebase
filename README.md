# angular2-firebase
A rich wrapper Angular 2 library for Firebase.

| `master`  | `all` |
| ------------- | ------------- |
| [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/s/master "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7) | [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/s "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7)  |
| [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/m/master "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7) | [![wercker status](https://app.wercker.com/status/159416890b9eb65d3c1e9a647f6ac7a7/m "wercker status")](https://app.wercker.com/project/bykey/159416890b9eb65d3c1e9a647f6ac7a7)  |

## Installation

The project is not on NPM yet as it is not finished. You can install it using git however:

```
npm install --save git://github.com/KallynGowdy/angular2-firebase.git
```

To use in your project, just reference the `angular2-firebase/core` module:

```TypeScript
import {FirebaseService} from 'angular2-firebase/core';
```

You may have to add the `node_modules` path to your `System.config({})`:

```TypeScript
System.config({
  // ...
  map: {
    'angular2-firebase': 'node_modules/angular2-firebase'
  }
});
```
