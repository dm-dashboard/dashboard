var List = require('complex-list');

function inherit(a,b){
  a.prototype = Object.create(b.prototype,{constructor:{
    value:a,
    enumerable:false,
    configurable:false,
    writable:false
  }});
}

function depChecker(targetpropfunc,targetdep,depfromlist,depfromlistcontainer){
  targetdep.resolve(targetpropfunc(depfromlist));
  if(targetdep.resolved()){
    return depfromlistcontainer;
  }
}

function addToListOfUnresolved(lobj,unres){
  lobj.list.push(unres.name);
}

function DependableList(){
  List.call(this);
  this.unresolved = new List();
}
inherit(DependableList,List);
DependableList.prototype.destroy = function(){
  this.unresolved.destroy();
  this.unresolved = null;
  List.prototype.destroy.call(this);
};
DependableList.dependableConstructor = function(){
  return Dependable;
};
DependableList.prototype.createDependable = function(){
  return new Dependable();
};
DependableList.prototype.getDependencyProperty = function(dependable){
  return dependable.name;
};
DependableList.prototype.plainAddReverse = function(afterdependable,dependable){
  this.plainAdd(dependable,afterdependable);
};
DependableList.prototype.plainAdd = function(dependable,afterdependable){
  var listforremove = new List(), listforadd = new List();
  var newdependablecontainer = List.prototype.add.call(this,dependable,afterdependable);
  this.unresolved.traverse(this.lateResolve.bind(this,listforremove,listforadd,newdependablecontainer,dependable));
  listforremove.traverse(this.unresolved.removeOne.bind(this.unresolved));
  listforadd.traverse(this.plainAddReverse.bind(this,newdependablecontainer));
  listforremove.destroy();
  listforadd.destroy();
};
DependableList.prototype.add = function(dependable){
  var depcheck = this.traverseConditionally(depChecker.bind(null,this.getDependencyProperty.bind(this),dependable));
  if(depcheck){
    this.plainAdd(dependable,depcheck);
    return;
  }
  if(dependable.resolved()){
    this.plainAdd(dependable);
  }else{
    this.unresolved.add(dependable);
  }
};
DependableList.prototype.lateResolve = function(listforremove,listforadd,newdependablecontainer,newdependable,unresolveddependable,unresolvedcontainer){
  unresolveddependable.resolve(newdependable.name);
  if(unresolveddependable.resolved()){
    listforremove.add(unresolvedcontainer);
    listforadd.add(unresolveddependable);
  }
};
DependableList.prototype.listOfUnresolved = function(){
  var lobj = {list:[]};
  this.unresolved.traverse(addToListOfUnresolved.bind(null,lobj));
  return lobj.list.join(',');
};

function Dependable(){
  this.dependencies = {};
  this.unresolved = {};
}
Dependable.prototype.destroy = function(){
  this.unresolved = null;
  this.dependencies = null;
};
Dependable.prototype.cloneDependencies = function(obj){
  for(var i in obj){
    this.dependencies[i] = obj[i];
    this.unresolved[i] = true;
  }
};
Dependable.prototype.resolve = function(depname){
  delete this.unresolved[depname];
};
Dependable.prototype.resolved = function(){
  for(var i in this.unresolved){
    return false;
  }
  return true;
};

module.exports = DependableList;
