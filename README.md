# ministore [![Build Status](https://travis-ci.org/SHOPMACHER/ministore.svg?branch=master)](https://travis-ci.org/SHOPMACHER/ministore) 

ministore is an async dispatch store.

## Table of Contents

* [Installation](#installation)
  * [UMD](#umd)
  * [AMD](#amd)
  * [CommonJS](#commonjs)
  * [ESM](#esm)
* [Usage](#usage)
  * [Initialization](#initilization)
  * [Register](#register)
  * [Dispatch](#dispatch)
* [Contributing](#contributing)
* [License](#license)

## Installation
Run `npm install -S @shopmacher/ministore` to install the package from npm.
Alternatively, you can download the latest release from this repository.

To include the library, refer to the module definition you are using.

### UMD
Include the `ministore.js` from the `lib` directory
in your project. This makes `ministore` available in the global scope.

### AMD
Adjust your `require.config.js` to include the following code:
```javascript
packages: [{
    name: '@shopmacher/ministore',
    location: 'node_modules/@shopmacher/ministore/lib',
    main: 'ministore'
}]
```

Now you can use the store in your project like this:
```javascript
define('myModule', ['@shopmacher/ministore'], function(Ministore) {
    // Access ministore object here
});
```

### CommonJS
Require the store via `const store = require('@shopmacher/ministore');` and use
the `store` variable to access its methods.

### ESM
Import the store via `import createStore from '@shopmacher/ministore';` and access it
via `const store = createStore();`.

## Usage
This section describes how to initialise the ministore.

### Initialization

Initialize the store with the `createStore()` method:

```javascript
const store = createStore();
```

### Register

You can access the store methods in `store`. Please note, that the handler must return a Promise.

```javascript
store.register('test', {
    handler: asyncFunction()
});
```
Optionally, you can add a priority to the listener object like
```javascript
store.register('test', {
    handler: asyncFunction1(),
    priority: 1
});

store.register('test', {
    handler: asyncFunction2(),
    priority: 2
});
```

### Dispatch
After registering the actions, you can dispatch the action with
```javascript
store.dispatch({ type: 'test' });
```
Also you can add a payload to the dispatch object like
```javascript
store.dispatch({ 
  type: 'test',
  payload: {}
});
```

## Contributing
To contribute to this project, fork the repository and create
your feature/hotfix branch with whatever you want to add.

Install the project dependencies using `npm i` and start the
development server via `npm start`. A webpack-dev-server will now
listen on port 8080.

When you are finished developing, make sure to provide unit tests 
as well as ensure the exsting tests are passing. 
Finally submit a documented pull request.

**Please note:** Pull requests for new features that are not typed via
flowtype as well as not following the general code style used in this
project will be rejected.

## License
MIT