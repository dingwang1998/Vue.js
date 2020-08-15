
//响应式区域
let ARRAY_METHOD = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'splice'
];
// 拦截push等方法
let arr_methods = Object.create( Array.prototype );
ARRAY_METHOD.forEach(method=>{
    //这个同名方法的push方法能接收到push传过来的arguments参数
    arr_methods[method] = function(){
        //监视push等方法之前
        //写到监视之前的话可以只去改修改的数据部分
        for(let i = 0; i<arguments.length; i++)
        {   
            observe(arguments[i])
        }
        //这个位置相当于push方法传递的参数为 array_method里面的需要使用apply改变this指向问题
        let res = Array.prototype[ method ].apply(this,arguments)

        //监视push等方法之后 
        // reactify(data)也可以解决for循环 data数会全部刷新
        return res
    }
})

//将对象转为响应式
function defineReactive(target, key, value, enumerable){
    //这个位置处理传过来的值为数组和对象都要处理
    if( typeof value === 'object' && value !=null)
    {
        observe( value )
    }
    let dep  = new Dep();
    dep.__propName = key;
    Object.defineProperty(target,key,{ 
        configurable:true,
        enumerable:!!enumerable,
        get(){
            console.log(`读取o的${key}属性`);
            //在这之前已经push了一次watcher
            dep.depend();
            return value;
        },
        set(newVal){
            console.log(`设置o的${key}属性为:${newVal}`)
            if(typeof newVal === 'object' && newVal !== null)
            {
                observe( newVal )
            }
            value = newVal

            dep.notify();
        }
    })
}

//将对象o变成响应式----个人觉得observe和reactify没区别
function observe(obj){
    if(Array.isArray(obj)){
        obj.__proto__ = arr_methods
        for(let i = 0; i< obj.length; i++){
            observe( obj[ i ])
        }
    }else{
        let keys = Object.keys( obj )
        for( let i = 0; i < keys.length; i++)
        {
            let prop = keys[ i ];
            defineReactive(obj , prop, obj[prop], true)
        }
    }
}



// 将某一个对象的属性的访问映射到对象的某一个属性成员
function porxy(target, prop, key){
    Object.defineProperty( target, key, { //defineproperty第二个参数为代理对象成员
            enumerable:true,
            configurable:true,
            get(){
                return target[ prop ][ key ]
            },
            set(newVal){
                target[prop][key] = newVal
            }
    })
}