
let depid = 0;
class Dep{
    constructor(){
        this.id = depid++;
        this.subs = []; //存储的是当前dep关联的watcher
    }
    // 添加一个watcher
    addsub(sub){
        this.subs.push(sub)
    }
    // 移除
    removeSub(sub){
        for( let i = this.subs.length -1; i >= 0; i-- )
        {
            if(sub === this.subs[ i ]){
                this.subs.splice(i, 1)
            }
        }
    }
    //将当前Dep与当前的watcher （暂时渲染的watcher）关联
    depend(){
        if(Dep.target){
            this.addsub(Dep.target);
            Dep.target.addDep( this )
        }
    }
    notify(){
        // 存储的watcher
        let deps = this.subs.slice();
        if(Dep.target){
            deps.forEach(watcher => {
                watcher.update()
            });    
        }
    }
}


//这个dep不是Dep里面的对象，相当于是个新对象
Dep.target = null; //默认暴露全局的watcher

let targetStack = [];

function pushTarget( target ){
    targetStack.unshift(target);
    Dep.target = target;
}

function popTarget(){
    Dep.target = targetStack.shift();
}




