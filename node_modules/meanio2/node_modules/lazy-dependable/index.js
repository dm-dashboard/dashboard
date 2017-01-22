var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function inherit(a,b){
  a.prototype = Object.create(b.prototype,{constructor:{
    value:a,
    enumerable:false,
    configurable:false,
    writable:false
  }});
}

function traverseArrayConditionally(arry,func){
  var l = arry.length, a, ret;
  for(var i=0; i<l; ++i){
    a = arry[i];
    if('undefined' === typeof a){
      continue;
    }
    ret = func(a,i,arry);
    if('undefined' !== typeof ret){
      return ret;
    }
  }
}

function Dependable(container,deps,action){
  this.container = container;
  this.deps = deps;
  this.action = action;
  this.resolved = null;
}
Dependable.prototype.destroy = function(){
  if(this.container.resolved && this.container.resolved[this.name] === this){
    delete this.container.resolved[this.name];
  }
  if(this.container.unresolved && this.container.unresolved[this.name] === this){
    delete this.container.unresolved[this.name];
  }
  this.resolved = null;
  this.action = null;
  this.deps = null;
  this.container = null;
};
Dependable.prototype.resolve = function(){
  if(null !== this.resolved){
    return;
  }
  this.resolved = [];
  traverseArrayConditionally(this.deps,this.tryResolve.bind(this))
  if(null !== this.resolved){
    if(this.resolved.length!==this.deps.length){
      console.log('my deps',require('util').inspect(this.deps,{depth:null}));
      throw 'How come there is '+this.resolved.length+' resolveds on '+this.deps.length+' deps?';
    }
    this.onResolved();
  }else{
    this.onUnresolved();
  }
};
Dependable.prototype.tryResolve = function(depname){
  var r = this.container.resolved[depname];
  if(typeof r === 'undefined'){
    this.resolved = null;
    return false;
  }
  this.resolved.push(r.fire());
};
Dependable.prototype.fire = function(){
  return ('function' === typeof this.action) ? this.runAction() : this.action;
};
Dependable.prototype.runAction = function(){
  return this.action.apply(null,this.resolved);
};

function Dependency(container,name,deps,action){
  this.name = name;
  this.hasresult = false;
  this.result = null;
  Dependable.call(this,container,deps,action);
}
inherit(Dependency,Dependable);
Dependency.prototype.destroy = function(){
  Dependable.prototype.destroy.call(this);
  this.hasresult = null;
  this.result = null;
  this.name = null;
};
Dependency.prototype.fire = function(){
  if(this.hasresult){
    return this.result;
  }else{
    return Dependable.prototype.fire.call(this);
  }
};
Dependency.prototype.runAction = function(){
  this.hasresult = true;
  this.result = Dependable.prototype.runAction.call(this);
  this.resolved = null;
  this.action = null;
  this.deps = null;
  return this.result;
};
Dependency.prototype.onResolved = function(){
  this.container.notifyResolved(this);
};
Dependency.prototype.onUnresolved = function(){
  this.container.unresolved[this.name] = this;
};

function Consumer(container,deps,action){
  if('function' !== typeof action){
    console.log(deps,action);
    throw 'Consumer must provide a consumer function';
  }
  Dependable.call(this,container,deps,action);
}
inherit(Consumer,Dependable);
Consumer.prototype.onResolved = function(){
  this.fire();
  this.destroy();
};
Consumer.prototype.onUnresolved = function(){
  this.container.consumers.push(this);
};


function Container(){
  this.resolved = {};
  this.unresolved = {};
  this.consumers = [];
}
function destroyAndDelete(obj,name){
  obj[name].destroy();
  delete obj[name];
}
Container.prototype.destroy = function(){
  while(this.consumers.length){
    this.consumers.pop().destroy();
  }
  this.consumers = null;
  for(var name in this.unresolved){
    destroyAndDelete(this.unresolved,name);
  }
  this.unresolved = null;
  for(var name in this.resolved){
    destroyAndDelete(this.resolved,name);
  }
  this.resolved = null;
};
Container.prototype.getParamNames = function (func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '')
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
  if(result === null){
    result = [];
  }
  return result;
}
Container.prototype.register = function(name,resolver){
  var deps = [];
  if('function' === typeof resolver){
    if(resolver.length){
      deps = this.getParamNames(resolver);
    }
  }
  var d = new Dependency(this,name,deps,resolver);
  d.resolve();
};
Container.prototype.get = function(depname){
  var r = this.resolved[depname];
  if(r){
    return r.fire();
  }
};
Container.prototype.resolve = function(consumer){
  if(typeof consumer === 'undefined'){
    throw 'Container got an "undefined" to resolve';
    return;
  }
  if(typeof consumer === 'function'){
    //dodado...
    return;
  }
  var deps;
  if(!(typeof consumer === 'object' && consumer instanceof Array)){
    deps = Array.prototype.slice.call(arguments);
  }else{
    deps = consumer;
  }
  var action = deps.pop();
  if('function' !== typeof action){
    return this.get(consumer);
  }
  var c = new Consumer(this,deps,action);
  c.resolve();
};
Container.prototype.notifyResolved = function(dependable){
  delete this.unresolved[dependable.name];
  this.resolved[dependable.name] = dependable;
  for(var i in this.unresolved){
    this.unresolved[i].resolve();
  }
  var cs = this.consumers;
  this.consumers = [];
  var c;
  while(cs.length){
    c = cs.pop();
    if(!c.action){continue;}
    c.resolve();
  }
};
Container.prototype.unregister = function(depname){
  var r = this.resolved[depname];
  if(r){
    destroyAndDelete(this.resolved,depname);
  }
  this.consumers.forEach(function(consumer){
    console.log(consumer);
  });
};

module.exports = {
  Container:Container
};
