lazy-dependable
===============

Motivation
-------------

This module was built as an in-place replacement for [dependable](https://github.com/idottv/dependable) in order to

1. Introduce "late resolving" (I preferred the word 'lazy' over 'late', hence the module name). In other words, once a piece of software asks for a dependency to be resolved, lazy-dependable will not complain if the designated dependency is still not registered.
2. Introduce more elegant ways for defining dependencies when asking for resolving. The only available mechanism in [dependable](https://github.com/idottv/dependable) is through names of the parameters in the dependency handler. This mechanism is severely sub-optimal, because it asks for stringifying the provided handler in order to parse the very parameter names. Moreover, this mechanism limits the handler programmers. **tldr**: you cannot reuse a single handler for different dependencies, you need to write the same function again, but with different names of input parameters.

Usage
-----------------

#### Create a Container
A Container is a single unit of dependency handling. It registers dependencies and resolves them for dependency consumers.
```javascript
var Container = require('lazy-dependable').Container;

var container = new Container();
container.register(...
container.resolve(...
container.get(...
//once/if you're done with your container, then don't forget to
container.destroy();
```

#### Register a dependency
```javascript
container.register('connection',connection);
```
`connection` is either an object or a function that will return a connection object.
You cannot register functions that will depend on other dependencies - this you can do with [dependable](https://github.com/idottv/dependable)


#### Consume dependencies
##### get
Use `get` when you need to check if the dependency is registered, because `get` returns immediately.
```javascript
container.get('connection',function(connection){
  if(!connection){
  }else{
  }
});
```
In the above example, if the `get` is called before connection is registered, you will get `undefined`.

##### resolve
If you have a function that needs a connection, you
```javascript
container.resolve('connection',function(connection){/*use connection*/});
```
`resolve` also supports the "Array notation":
```javascript
container.resolve(['connection',function(connection){/*use connection*/});
```
and, of course, the "dependable notation":
```javascript
container.resolve(function(connection){/*use connection*/});
```
**tldr**: if `resolve` gets a function as a first parameter, it will stringify/parse it to read the names of dependables you need.

##### Chain dependency providers
You can register functions that will depend on other dependencies and chain dependency providers. For example, if you cannot provide a `database` without obtaining a `configuration` first, you register your `database` provider in the following manner:
```javascript
container.register('database',function(configuration){
  //use the configuration to produce your database connection
  var database = createDatabase(configuration);
  //and finally
  return database;
});
```

