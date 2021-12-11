    // 二维数组转化为一维数组

 // reduce
var arr = [[1,2,3],[4,5],[2]]
var arr1 = arr.reduce(function(a, b) {
    return a.concat(b);
})
console.log(arr1)

// flat()
var arr = [[1,[2,3]],[4,5],[2]]
var arr2 = arr.flat(2)
console.log(arr2)

    // 数组的求和

// 常规求和

var arr=[1,2,3,4]
function summation(arr) {
    var sum =0;
    for(var i =0; i<arr.length; i++) {
        sum +=arr[i];
    }
    return sum;
}
var sum1 = summation(arr)
console.log(sum1)

// reduce
var arr=[1,2,3,4]
var arr1 = arr.reduce(function(a, b) {
    return a+b
})
console.log(arr1)

// forEach
var arr=[1,2,3,4]
function sumFor(arr) {
    let s=0;
    arr.forEach(item => {
        s += item;
    })
    return s;
}
let sum2 = sumFor(arr) ;
console.log(sum2)


 // 防抖 debounce （cleartimeout， settimeout）

 // 在第一次触发事件时，不立即执行函数，而是给出一个期限值比如200ms，然后：
 // 如果在200ms内没有再次触发滚动事件，那么就执行函数
 // 如果在200ms内再次触发滚动事件，那么当前的计时取消，重新开始计时
 function debounce(fn, delay) {
    let timer = null;

    return function() {
        if(timer) {
            clearTimeout(timer)
        } 
        timer = setTimeout(fn, delay) // settimeout第一个参数为函数，第二个为等待时间。在这个时间之后再执行函数fn
    }
}

      //  节流 throttle （settimeout，时间戳（new Date()））
// 每到指定时间生效一次
// 如果短时间内大量触发同一事件，那么在函数执行一次之后，该函数在指定的时间期限内不再工作，直至过了这段时间才重新生效。
function throttle(fn, delay) {
    var pre = new Date();
    return function() {
        var now = new Date();
        if(now - pre >= delay) {
            fn();
            pre = new Date();
        }
    }
}
function showTop() {
    var scrollTop = document.body.scrollTop  + document.documentElement.scrollTop;
　　console.log('滚动条位置：' + scrollTop);
}
window.onscroll  = debounce(showTop, 1000)


     //  call(), apply(), bind()， 第一个参数都是this的指向对象

     obj.myFun.call(db,'成都','上海');　　　　
     obj.myFun.apply(db,['成都','上海']);      
     obj.myFun.bind(db,'成都','上海')(); 


// call()
//传递参数从一个数组变成逐个传参了,不用...扩展运算符的也可以用arguments代替
Function.prototype.myCall = function (context, ...args) {
    //这里默认不传就是给window,也可以用es6给参数设置默认参数
    context = context || window
    args = args ? args : []
    //给context新增一个独一无二的属性以免覆盖原有属性
    const key = Symbol()
    context[key] = this
    //通过隐式绑定的方式调用函数
    const result = context[key](...args)
    //删除添加的属性
    delete context[key]
    //返回函数调用的返回值
    return result
}
    
// apply()
//  1. 先给Function原型上扩展个方法并接收2个参数,
 Function.prototype.myApply = function (context, args) {
        // 2.这里默认不传就是给window,也可以用es6给参数设置默认参数
        context = context || window
        args = args ? args : []
        // 3.给context新增一个独一无二的属性以免覆盖原有属性
        const key = Symbol()
        context[key] = this
        // 4.通过隐式绑定的方式调用函数
        const result = context[key](...args)
        // 5.删除添加的属性
        delete context[key]
        // 6.返回函数调用的返回值
        return result
    }

// bind()
// 定义这个方法为myBind

/*
 1. bind 会创建一个新函数，不会立即执行
 2. bind 后面传入的这个参数列表可以分多次传入，call和apply则必须一次性传入所有参数。
*/

/*
    bind和apply的区别在于,bind是返回一个绑定好的函数,apply是直接调用.
    就是返回一个函数,里面执行了apply上述的操作而已.
    不过有一个需要判断的点,因为返回新的函数,
    要考虑到使用new去调用,并且new的优先级比较高,所以需要判断new的调用,
    还有一个特点就是bind调用的时候可以传参,
    调用之后生成的新的函数也可以传参,效果是一样的,所以这一块也要做处理 
    因为上面已经实现了apply,这里就借用一下,实际上不借用就是把代码copy过来

*/
Function.prototype.myBind = function (context, ...args) {
    const fn = this
    args = args ? args : []
    return function newFn(...newFnArgs) {
        if (this instanceof newFn) {
            return new fn(...args, ...newFnArgs)
        }
        return fn.apply(context, [...args,...newFnArgs])
    }
}


                    //  手写promise

                   手写Promise实现过程
                   1. Promise 基本结构
                   2. 状态管理
                   3. then方法
                   4. 发布订阅模式登场
                   5. 经典的链式调用实现
                   6. 最后的catch方法

1.实例化Promise对象时传入一个函数作为执行器，有两个参数（resolve和reject）分别将结果变为成功态和失败态。

2.已经是成功态或是失败态不可再更新状态,因此我们在更新状态时要判断，如果当前状态是pending（等待态）才可更新。
（pendding, fulfilled, rejected）

3. 每一个Promise实例都有一个then方法，它用来处理异步返回的结果，它是定义在原型上的方法。
// 当我们自己实例化一个Promise时，其执行器函数（executor）会立即执行
因此，当实例化Promise时，构造函数中就要马上调用传入的excutor函数执行，为了防止出错，加入try，catch.

当Promise的状态发生了改变，不论是成功或是失败都会调用then方法。所以，then方法的实现，根据status状态来调用不同的回调函数。

4. 在执行 then 方法时如果还在等待态（pending），就把回调函数临时寄存到一个数组里，当状态发生改变时依次从数组中取出执行就好.
首先在类上新增两个Array类型的数组，用于存放回调函数,在then方法里添加进去, 在resolve() 与reject() 里逐一遍历

5. 为了保证链式调用，上一次then中不管你是成功还是失败都会把参数作为下一个then中成功时回调的参数,只需要再new一个Promise即可

6. 其实catch方法就是then方法的简写









 





                            // 深拷贝 
// (实现深拷贝，就是遍历对象的key,并将value赋给新的对象的key,如果原对象的属性值为对象，则递归调用深拷贝方法)

/**
 * 浅拷贝： 创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值，
 * 如果属性是引用类型，拷贝的就是内存地址 ，所以如果其中一个对象改变了这个地址，就会影响到另一个对象。
 *      (1)Object.assign()
 *      (2)Array.prototype.slice()
 *      (3)拓展运算符...
 * 深拷贝： 将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象。
 *      (1)JSON.parse(JSON.stringify(object))
 *          缺点： 
 *          1. 无法实现对函数，正则的克隆，返回都是 {}
 *          2. 对象有循环引用,会报错
 *          3. 如果被拷贝的对象中某个属性的值为undefined，则拷贝之后该属性会丢失
 *      (2)浅拷贝+递归（只考虑了普通的 object和 array两种数据类型）
 */


  function isObject(obj) {
      return typeof obj === 'object' && obj !== null;
  }
  function deepCopy(source) {
      // 判断参数不是一个对象，返回参数
      if(!isObject(source)) return source;
      // 判断参数是对象还是数组来初始化返回值
      let res = Array.isArray(source) ? []: {};
      // 循环参数对象的key
      for(let key in source) {
          // 如果该key属于参数对象本身, hasOwnProperty表示是否有自己的属性
          if(source.hasOwnProperty(key)) {
            // 如果该key的value值是对象，递归调用深拷贝方法进行拷贝
            if(isObject(source[key])) {
                res[key] = deepCopy(source[key]);
            } else {
                // 如果该key的value值不是对象，则把参数对象key的value赋值给返回值的key
                res[key] = source[key];
            }
          }
      }
      // 返回返回值
      return res;
  }

  // test data
let obj2 = deepCopy(obj1);
console.log(obj1);
console.log(obj2);
console.log(obj2.sy === obj1.sy)
obj2.name = 'obj2.name';
obj2.say();


                  // 居中


 1. transform
 
 .center {
     position: fixed;
     width: 300px;
     height: 300px;
     top: 50%; // 上边距距离边界的偏移
     left: 50%;
     transform: translate(-50%, -50%); // 往x轴,往y轴移动自身长宽的 50%，以使其居于中心位置。
     background-color: pink;
 }

 2. flex布局
 .center2 {
    height: 100vh;
    margin: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: pink;
 }


        //  js事件循环

js是单线程语言，当遇到异步操作的时候不可能一直等待异步结果。
所有的任务都会在主线程执行，在主线程之外还有个任务队列。只要异步任务有了结果，就会放到任务队列中。
一旦主线程中的所有同步任务执行完，系统就会读取任务队列中的异步任务，放到主线程执行。

异步任务又分为了宏任务和微任务。
宏任务（script(整体代码)、setTimeout、setInterval、UI 渲染、 I/O、postMessage、 MessageChannel、setImmediate(Node.js 环境)）
微任务（Promise、 MutaionObserver、process.nextTick(Node.js环境））

    Event Loop(事件循环)中，每一次循环称任务如下：

    执行栈选择最先进入队列的宏任务(通常是script整体代码)，如果有则执行
    检查是否存在 Microtask，如果存在则不停的执行，直至清空 microtask 队列
    更新render(每一次事件循环，浏览器都可能会去更新渲染)
    重复以上步骤




                           //  跨域
  1. /* jsonp (1，只能get请求。2，要服务端一起配合)
   该协议的一个要点就是允许用户传递一个callback参数给服务端，
   然后服务端返回数据时会将这个callback参数作为函数名来包裹住JSON数据，并构造出一个执行该函数的字符串
   */

// 客户端
<script>
    function getInfo(data) {
        console.log(data);
    }
</script>
<script src='http://localhost:8080?callback=getInfo'></script>


// 服务端返回
getInfo({'status': true, 'username': 'admin'})

 2. postMessage跨域



 3. 跨域资源共享（CORS）

 浏览器将CORS请求分为两类： 简单请求和非简单请求

 只要同时满足以下两大条件，就属于简单请求。

（1) 请求方法是以下三种方法之一：

HEAD
GET
POST
（2）HTTP的头信息不超出以下几种字段：

Accept
Accept-Language
Content-Language
Last-Event-ID
Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

4. nginx反向代理接口跨域
跨域原理： 同源策略是浏览器的安全策略，不是HTTP协议的一部分。
服务器端调用HTTP接口只是使用HTTP协议，不会执行JS脚本，不需要同源策略，也就不存在跨越问题。

实现思路：通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，
并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。


        

   

                       // 两个浏览器窗口间通信总结

 1. localStorage
// 一个窗口更新localStorage，另一个窗口监听window对象的”storage”事件，来实现通信

// 本窗口的设值代码
localStorage.setItem('aaa', (Math.random()*10).toString())

// 其他窗口监听storage事件
window.addEventListener("storage", function (e) {
  console.log(e)
  console.log(e.newValue)
})

2. WebSocket

// 所有的WebSocket都监听同一个服务器地址，
 // 利用send发送消息，利用onmessage获取消息的变化，不仅能窗口，还能跨浏览器，兼容性最佳，只是需要消耗点服务器资源。

 var ws = new WebSocket("ws://localhost:3000/")
ws.onopen = function (event) {
  // 或者把此方法注册到其他事件中，即可与其他服务器通信
  ws.send({now : Date.now()}); // 通过服务器中转消息
};
ws.onmessage = function (event) {
  // 消费消息
  console.log(event.data);
}

3.postMessage
// otherWindow.postMessage(message, targetOrigin, [transfer]);
// message：发送的信息
// targetOrigin：哪些窗口能接受信息

popup.postMessage("The user is 'bob' and the password is 'secret'",
                  "https://secure.example.net");




                  // redux

Store的角色是整个应用的数据存储中心，集中大部分页面需要的状态数据；
ActionCreators ,view 层与data层的介质；
Reduce ，接收action并更新Store。
所以流程是 用户通过界面组件 触发ActionCreator，携带Store中的旧State与Action 流向Reducer,Reducer返回新的state，并更新界面。
                  


// 受控组件：
从字面理解，就是组件受到了react的状态控制，

。所以要使用setState才能进行修改内容

当input、textarea、select等中设置了value属性时，将变成受控组件，使用onChange事件进行触发。

// 非受控组件：
就是组件的状态不收到react控制，不用setState。
一般会选择使用ref。如果需要value有默认值 则可使用defaultValue属性


// 浏览器解析url过程

1 用户输入 URL 地址。
2 对 URL 地址进行 DNS 域名解获得IP地址。
3 建立 TCP 连接（三次握手）。
4 浏览器向 web 服务器发送一个 HTTP 请求报文。
5 服务器返回 HTTP 响应报文给客户端。	
6 关闭 TCP 连接（四次挥手）。
7 浏览器解析文档资源并渲染页面。

// 原型，原型链
原型是一个可以被复制（或者叫克隆）的一个类，通过复制原型可以创建一个一模一样的新对象。
原型链是原型对象创建过程的历史记录。

// js获取原型的方法
p._proto_
p.constructor.prototype
Object.getPrototypeOf(p)


// 普通函数和箭头函数的区别:
1. 箭头函数没有 prototype(原型)，所以箭头函数本身没有 this
2. 箭头函数的 this 在定义的时候继承自外层第一个普通函数的 this。
3. 如果箭头函数外层没有普通函数，严格模式和非严格模式下它的 this 都会指向 window(全 局对象)
4. 箭头函数本身的 this 指向不能改变，但可以修改它要继承的对象的 this。
5. 箭头函数的 this 指向全局，使用 arguments 会报未声明的错误。
6. 箭头函数的 this 指向普通函数时,它的 argumens 继承于该普通函数
7. 使用 new 调用箭头函数会报错，因为箭头函数没有 prototype(原型)
8. 箭头函数不支持 new.target
9. 箭头函数不支持重命名函数参数,普通函数的函数参数支持重命名
10. 箭头函数相对于普通函数语法更简洁优雅

// new关键字（4步）
1.创建一个空对象
2.链接到原型
3.绑定this的指向，并执行构造函数
4.确保返回的是一个对象



// BFC (块级格式化上下文，它是一个独立的渲染区域，与外部无关)

如何创建BFC：
1.根元素body
2.设置浮动，flote: let/right 值不为none。
3.绝对定位元素，position: absolute/fixed
4.display: inline-block.....
5.overflow: auto/hidden/none  值不为visible

作用：解决高度塌陷和外边距重叠（overflow: hidden）
高度塌陷：在文档流中，父元素的高度默认是被子元素撑开的，也就是子元素多高，父元素就多高。但是当子元素设置浮动之后，子元素会完全脱离文档流，此时将会导致子元素无法撑起父元素的高度，导致父元素的高度塌陷。

垂直外边距重叠：子元素相对于父元素设置了margin-top,按理来说父元素是固定的，但父元素也整体margin-top，就出现了子元素与父元素都margin-top了，外边距重叠了。


// 用hooks实现 生命周期

 // compoenntDidMount 挂载后
useEffect(() => {
   console.log('compoenntDidMount')
}, [])


// compoentWillUnmount  卸载 ，在此处完成组件的卸载和数据的销毁。
useEffect(() => {
    return () => {
   console.log('compoentWillUnmount')
    }
}, [])



// 自定义hook  -- 获取鼠标当前坐标

const useMousePosition = ()=> {
    const [position, setPosition] = useState({x: 0, y: 0});
    useEffect(() => {
        const updateMouse = (e)=> {
            setPosition({x: e.clientX , y :e.clientY})
        }
        document.addEventListener('mousemove', updateMouse)
        return () => {
            document.removeEventListener('mousemove', updateMouse)
        }
    })
    return position
}
export default useMousePosition


// 自定义hook， --- 获取当前浏览器窗口大小

const useWinsize = ()=> {
    const [state, setstate] = useState({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    })
    useEffect(() => {
        const updateSize = () => {
            setstate({
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            })
        }
        document.addEventListener('resize', updateSize)
        return () => {
            document.removeEventListener('resize', updateSize)
        }
    }, [])
    return size;
}
export default useWinsize



// 浏览器缓存(http缓存)
浏览器会根据 http response header 中的 Expires 和cahe-control 字段判断是否命中强缓存，
如若命中，则直接从缓存中取资源，不会再去向服务器请求了。
否则（没有命中强缓存），浏览器会发出一个条件请求，
浏览器会在请求头中包含 If-Modified-Since 或 If-None-Match 字段，
If-Modified-Since 即浏览器当初得到的 Last-Modified；If-None-Match即浏览器当初得到的 ETag。
当服务器发现资源的更新时间晚于 If-Modified-Since 所提供的时间，
或者资源在服务器端当前的 ETag 和 If-None-Match 提供的不符时，说明该资源需要向服务器重新请求了。
否则，浏览器将不需要重新下载整个资源，只需要从缓存中去加载这个资源，这时响应的http code 为 304（304 Not Modified）。


// slice和splice的区别
slice(start, end): 方法可从已有数组返回选定的元素，返回一个新数组，包含从start到end（不包含end）的数组元素

该方法不改变原数组，而是返回一个子数组。
var arr = [1,2,3,4,5]
console.log(arr.slice(1))  // [2,3,4,5]
console.log(arr.slice(1,3))  // [2,3] // 不包含end

同时，slice（start,end）可以作为字符串的切割



splice()：该方法向或者从数组中添加或者删除项目，返回被删除的项目。（该方法会改变原数组）

splice（index,howmany,item1,...itemX）
index参数：必须，整数，规定添加或者删除的位置，使用负数，从数组尾部规定位置。
howmany参数：必须，要删除的数量，如果为0，则不删除项目。
tem1,...itemX参数：可选，向数组添加的新项目。

var arr =[1,2,3,4,5]
console.log(arr.splice(2,1,'hello')) // [3] 返回的新数组
console.log(arr) // [1,2,'hello',4,5] 改变了原数组
// map,filter,foreach的区别
1， forEach循环，循环数组中每一个元素并采取操作， 没有返回值， 可以不用知道数组长度

2， map函数，遍历数组每个元素，并回调操作，需要返回值，返回值组成新的数组，原数组不变

3，filter函数， 过滤通过条件的元素组成一个新数组， 原数组不变


// object怎么添加属性
var person = {name: 'yangjie'}
person.age = 13;
person['mother']= 'lady'

