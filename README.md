# firebase-angular2
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

To use in your project, reference the `firebase-angular2/core` module:

```TypeScript
import {FirebaseService} from 'firebase-angular2/core';
```

also make sure you include the Firebase JavaScript SDK:

```
<script src="node_modules/firebase/lib/firebase-web.js"></script>
```

Finally, you may have to add the `node_modules` path to your `System.config({})`:

```TypeScript
System.config({
  // ...
  map: {
    'firebase-angular2': 'node_modules/angular2-firebase'
  }
});
```
