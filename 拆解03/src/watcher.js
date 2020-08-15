//观察者，用于发射更新的行为
let watcherid = 0;
class Watcher{

    constructor(vm, expOrfn){
        this.vm = vm;
        this.getter = expOrfn;

        this.id = watcherid++;
        this.deps = []; //依赖项
        this.depIds = {}; //是一个set类型，用于保证 依赖项的唯一 ，简化的代码不实现
        this.get();
    }
    // 执行触发getter
    get(){
        pushTarget(this)

        this.getter.call(this.vm, this.vm);//上下文的问题就解决了

        popTarget()
    }
    // 执行，并判断懒加载，还是同步加载，还是异步加载
    // 我们现在只考虑一部加载（简化的部分是同步加载）
    run(){
        this.get()
    }
    // 对外公开的函数，用于在属性发生变化时触发的接口
    update(){
        this.run()
    }
    //清空依赖队列
    cleanupDep(){

    }
    addDep(dep){
        this.deps.push(dep)
    }
}