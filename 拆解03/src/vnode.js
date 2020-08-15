//虚拟dom的面向对象
class Vnode {
    //tag 为标签名称 data为属性对象 value为标签下的文本标签值 type为标签类型
    constructor(tag,data,value,type){
        this.tag = tag && tag.toLowerCase();
        this.data = data;
        this.value = value;
        this.type = type;
        this.children = [] //子元素的数据也需要在这里定义
    }
    appendChild(vnode){
        this.children.push(vnode)
    }
}