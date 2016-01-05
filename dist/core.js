function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
//export * from './src/imports';
__export(require('./src/firebase.service'));
__export(require('./src/firebase-utils'));
__export(require('./src/firebase-auth.service'));
__export(require('./src/firebase.config'));
//# sourceMappingURL=core.js.map