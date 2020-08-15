DwVue.prototype.mount = function (){
    // 缓存了render
    this.render = this.createRenderFn();

    this.mountComponent();
}
DwVue.prototype.mountComponent = function(){
    let mount = ()=>{
        this.updata ( this.render() )
    }
    // mount.call(this)
    new Watcher(this, mount) 
}

DwVue.prototype.createRenderFn = function(){
    //模拟缓存 ast 缓存带坑的vnode
    let ast = getVNode( this._template )
    return function render(){
        // 将 ast 与 data 结合形成 vnode
        let tep =  combine(ast, this._data)
        return tep;
    }
}
DwVue.prototype.updata = function( vnode ){
    let realDOM =  parseVnode(vnode)
    this._parent.replaceChild( realDOM ,document.querySelector("#root"))
}
//在reactify的基础上套一层函数然后就行一次进行proxy,进行事件代理
DwVue.prototype.initData = function(){

    let keys = Object.keys(this._data)
    //响应式
    observe(this._data)
    //事件代理
    for(let i = 0; i< keys.length; i++){
        porxy(this, '_data', keys[ i ])
    }
}