// 实际dom转为dom树 ---在vue里这里称为抽象语法树
function getVNode (node){
    let nodeType = node.nodeType;
    let _vnode = null;
    //1为标签节点
    if(nodeType === 1){
        let nodeName = node.nodeName;
        let attrs = node.attributes; //  属性节点的nodetype为2  attributes拿到的是节点数组
        //虚拟dom的对象
        let _attrObj = {};
        for(let i = 0; i < attrs.length; i++){
            _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
        }
        _vnode = new Vnode(nodeName,_attrObj, undefined,nodeType)
        //考虑node的子元素
        let childNodes = node.childNodes;
        for(let i = 0; i< childNodes.length;i++){
            //加到对象的子元素
            _vnode.appendChild( getVNode(childNodes[i]) )
        }
    }else if(nodeType === 3){
        _vnode = new Vnode( undefined,undefined, node.nodeValue, node.nodeType)
    }
    return _vnode;
}
//dom树转为实际节点
function parseVnode (vnode){
    let type = vnode.type;
    let _node = null;
    if(type === 3){
        return document.createTextNode( vnode.value )
    }else if( type === 1 ){
        _node = document.createElement( vnode.tag )
        let data = vnode.data;
        Object.keys( data ).forEach( (key)=>{
            let attrName = key;
            let attrValue = data[ key ];
            _node.setAttribute( attrName, attrValue );
        })
        let children = vnode.children;
        children.forEach (subvnode =>{
            _node.appendChild( parseVnode(subvnode) )
        })
    }
    return _node;
}



// 虚拟dom树与data结合产生的还是为虚拟dom树 模仿vue ast与data产生新的vnode
let rkuohao = /\{\{(.+?)\}\}/g;
//解决data中的嵌套数据问题  可以使用柯里化进行优化
function getValuebyPath(obj,path)
{
    let paths = path.split('.');
    let res = obj;
    while(prop = paths.shift()){
        res = res[ prop ]
    }
    return res
}
function combine (vnode, data){
    let _type = vnode.type;
    let _data = vnode.data;
    let _value = vnode.value;
    let _tag = vnode.tag
    let _children = vnode.children
    let _vnode = null;
    if(_type === 3){
        _value = _value.replace(rkuohao,function(_, g){
            return getValuebyPath (data, g.trim())
        })
        _vnode = new Vnode(_tag, _data, _value,_type)
    }else if ( _type === 1){
        _vnode = new Vnode(_tag, _data, _value, _type)
        _children.forEach( _subvnode => _vnode.appendChild( combine(_subvnode, data)))
    }
    return _vnode 
}