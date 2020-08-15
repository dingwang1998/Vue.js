//vue的面向对象
function DwVue ( options ){
    this._data = options.data;
    this.elm = document.querySelector( options.el )
    this._template = this.elm;
    this._parent = this.elm.parentNode;
    //数据全部变为响应式再去挂在render
    // reactify(this._data,this)
    this.initData()
    this.mount();
}