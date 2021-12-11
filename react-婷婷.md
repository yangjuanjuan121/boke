## React Hooks 生命周期用法
## useState

const [state, setState] = useState([]); //传入默认值
useState 返回的是一个数组, 第一个是变量值,第二个 是类似于 this.setState 的用法

// 第一个种写法, 不一定 会触发 render的刷新
setState(1);

// 第二种写法
有时候 你会发现,就算设置了 setState 也不一定 刷新页面,项目中,子元素的 checkbox的选择
这里 你需要 使用 class 的 forceUpdate api, hooks的用法是, 只要是值 改变 你就会渲染

cosnt [forceUpdate, setForceUpdate] = useState(0);
// 这样子写 就跟 forceUpdate, 拿到之前的值,进行处理
setForceUpdate((val)=> val + 1);

## useEffect 

// 里面不穿参数, 每次render 都会执行, 类似于 componentWillReceiveProps
useEffect(()=>{

});

// 传入空数组 只加载一次 相当于 componentDidMount
useEffect(()=>{

}, []);

// 当 aaa的值 变化了, 才执行里面的内容
// 这里 最重要的是要 判断 aaa 是不是基本类型的值(Number,Boolean,Null,Undefined,String,Symbol)
// 如果是 Object 类型, 可能会出现 死循环,因为 父组件 传递下来的 obj 引用一直在变化, 解决方法 值,把
//aaa 变成 字符串,变成基本类型, JSON.stringify(aaa), 就可以解决 这个是一个大坑,平时开发的时候 需要//注意

useEffect(()=>{

}, [aaa]);

// 当 aaa的值 变化了, 才执行里面的内容
useEffect(()=>{

    // return 这个值 是相当于 componentWillUnmount 的作用
    return ()=>{

    };
}, []);


## useRef 
const aaa = useRef();

aaa.current = "bbb";

useRef 它的更新 是不会 刷新 render的, 这个和 useState 是一个区别

useRef 你可以理解它是一个变量 赋值,只要是 赋值了, 马上就可以拿到值, 而useState 需要等待 重新render 刷新页面 才可以拿到值, 项目中 用到  setTimeout(search, 0), 是因为 setTimeout是宏任务,要等待页面的程序 加载完成之后 才执行, 设置的0, 其实它有一个最小值, 是4毫秒,当小于4,默认按照4毫秒执行


（ useMemo 和 useCallback都会在组件第一次渲染的时候执行，之后会在其依赖的变量发生改变时再次执行；
并且这两个hooks都返回缓存的值，useMemo返回缓存的变量，useCallback返回缓存的函数。）
## useMemo
这个相当于是 优化, 返回的是一个, 值 , 当count 变化了,才执行里面的内容 

const countValue= useMemo(() => {
       let result = Math.random() * count;
        return result;
}, [count]);

## useCallback
这个 也是优化 只不过这个是 返回的一个 函数
  const fetchData = useCallback(() => {
    const url =
      "https://count=" + this.state.count + "&step=" + this.state.step;
  }, [count, step])

<Child fetchData={fetchData} />

## memo
这个相当于 class 组件的 PureComponent ,无状态组件, 也是 优化 用的
如果不穿 第二个参数,它会根据变化了 自己来优化
如果穿了 第二个参数,就是你指定的数据变化了 才变化, 一般 不穿第二个参数就是了

const Aaa = memo(function() {}, [ss]);

## useImperativeHandle
这个是 用来父组件 调用 子组件的方法, 这个还需要 用到useRef的配合, va managemnt add页面有用到

## useContext （可以帮助我们跨越组件层级直接传递变量，实现共享。）

多层级 跨组件使用, 其实redux就可以解决了 ...

如何使用useContext
1.根组件导入并调用createContext方法，得到Context对象，并导出
import { createContext } from 'react'
export const Context = createContext()

2.在根组件中使用 Provider 组件包裹需要接收数据的后代组件，并通过 value 属性提供要共享的数据
return (
  <Context.Provider value={ 这里放要传递的数据 }>
  	需要接收数据的后代组件
  </Provider>
）
3.需要获取公共数据的后代组件：导入useContext,并按需导入根组件中导出的Context对象；调用useContext(第一步中导出的Context) 得到value的值
import React, { useContext } from 'react'
import { Context } from './index'
const 函数组件 = () => {
    const 公共数据 = useContext(Context) // 这里的公共数据就是根组件value的值
    return ( 函数组件的内容 )
}

## useReducer 
我们项目组 用了 redux, 所以就没用了, 如果你以后 要面试的话, 会问你, hooks,怎么 实现一个 redux的功能,
就要用到 useReducer,useContext,useState











