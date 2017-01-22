function ListItem(content){
  this.link = null;
  this.content = content;
}
ListItem.prototype.destroy = function(){
  this.content = null;
  this.link = null;
};
ListItem.prototype.linkTo = function(item){
  if(item){
    if(item.link){
      this.link = item.link;
    }
    item.link = this;
  }
};
ListItem.prototype.empty = function(){
  return 'undefined' === typeof this.content;
};
ListItem.prototype.apply = function(func){
  if('undefined' !== typeof this.content){
    return func(this.content,this);
  }else{
    return false;
  }
};

function defaultSorter(){
  return false;
}
function List(sortfunction){
  this.head = new ListItem();
  this.sorter = sortfunction || defaultSorter;
  this.length = 0;
}
List.prototype.destroy = function(){
  this.purge();
  this.length = null;
  this.sorter = null;
  this.head = null;
};
List.prototype.purge = function(){
  var item = this.head, ditem;
  while(item){
    ditem = item;
    item = item.link;
    ditem.destroy();
  }
  this.head.content = void 0;
  this.length=0;
};
List.prototype.empty = function(){
  return !this.head.content;
};
List.prototype.add = function(content,afteritem){
  if(this.head.empty()){
    this.head.content = content;
    this.length = 1;
    return this.head;
  }
  var newitem = new ListItem(content);
  var item = afteritem || this.lastItemToSatisfy(this.sorter.bind(null,content));
  if(!item){
    this.head.linkTo(newitem);
    this.head = newitem;
  }else{
    newitem.linkTo(item);
  }
  this.length++;
  return newitem;
};
List.prototype.removeOne = function(listitem){
  var item = this.head, previtem;
  while(item){
    if(item===listitem){
      if(item===this.head){
        if(item.link){
          this.head = item.link;
          item.destroy();
        }else{
          this.head.content = void 0;
        }
      }else{
        previtem.link = item.link;
        item.destroy();
      }
      this.length--;
      return;
    }
    previtem = item;
    item = item.link;
  }
};
List.prototype.findOne = function(criterionfunction){
  var item = this.firstItemToSatisfy(criterionfunction);
  if(item){
    return item.content;
  }
};
List.prototype.firstItemToSatisfy = function(func){
  var check=false, item = this.head;
  while(!check&&item){
    check = item.apply(func);
    if('boolean' !== typeof check){
      throw 'func needs to return a boolean value';
    }
    if(check){
      return item;
    }else{
      item = item.link;
    }
  }
  return item;
};
List.prototype.lastItemToSatisfy = function(func){
  var check, item = this.head, ret;
  while(item){
    check = item.apply(func);
    if('boolean' !== typeof check){
      throw 'func needs to return a boolean value';
    }
    if(!check){
      return ret;
    }else{
      ret = item;
      item = item.link;
    }
  }
  return ret;
};
List.prototype.traverse = function(func){
  var item = this.head;
  while(item){
    item.apply(func);
    item = item.link;
  }
};
List.prototype.traverseConditionally = function(func){
  var result, item = this.head;
  while(item){
    result = item.apply(func);
    if('undefined' !== typeof result){
      return result;
    }
    item = item.link;
  }
};
List.prototype.dumpToConsole = function(){
  this.traverse(console.log.bind(console));
};
function drainer(arry,countobj,content){
  arry[countobj.count] = content;
  countobj.count++;
}
List.prototype.drain = function(){
  var ret = new Array(this.length),countobj={count:0};
  this.traverse(drainer.bind(null,ret,countobj));
  this.purge();
  return ret;
};

module.exports = List;
