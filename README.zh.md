<h3 style='line-height: 40px;'>
  <span>ieval 远程代码加载工具</span>
  <a href="https://github.com/tang-haibo/remote-import/actions/workflows/deploy.yml/badge.svg">
    <img src="https://github.com/tang-haibo/remote-import/actions/workflows/deploy.yml/badge.svg" alt="Build Status">
  </a>
  <a href='https://coveralls.io/github/tang-haibo/remote-import?branch=master'>
    <img src='https://coveralls.io/repos/github/tang-haibo/remote-import/badge.svg?branch=master' alt='Coverage Status' />
  </a>
</h3>
<p align='center'>
  <a href='README.md'>English</a>
  |
  <b>中文文档</b>
</p>

### 它能做什么?
* 减小小程序的大小体积
* 帮助您将静态需要提交审核的代码转换为动态可执行代码，在不支持的环境实现项目的动态加载
* 当你在一个不支持浏览器的环境中实现'document' 'window' context对象时，我们可以将它用于低代码、多平台的动态加载执行

### 它是如何工作的?
* 我尝试通过@babel/parser的语法树实现动态代码执行
* 但是‘ieval’需要指定实现的上下文，因为每个独立的环境都应该由业务本身维护，否则将大大增加我们的维护成本
### 它的优点是什么?
* 与EVAL5和CanJS相比，它们是基于“Acorn”代码执行的，尽管“@babel/ Parser”也基于它，但部分代码实际上是不兼容的，所以‘ieval’可以完全直接使用Babel编译的代码运行，或者直接使用‘@babel/ Parser’生成的AST代码运行。
* 我们实现了完整的单元测试，包括switch if break operator function var return…

### 文档
#### 安装
```javascript
npm install ieval
```
#### DocumentEval 类
``` javascript
import {DocumentEval} from 'ieval';

// To set the URL request, 'ieval' needs to return a complete executable code string via 'Promise'
DocumentEval.setNetwork(url => {
  return new Promise(resolve => {
    wx.request({
      url: url,
      success: data => {
        resolve(data.data);
      },
    })
  });
});

// 这个环境变量特别重要，因为它是我们在JS代码中所依赖的系统对象所需要的，比如window global文档
// 如果当前执行的代码不需要系统对象，我们可以将其留空，以避免在执行过程中出现安全问题
const context = {};


// 然后我们使用'getWindow'来获得在我们执行的代码中声明的全局变量
const ieval = new DocumentEval(context);

// 在上下文中插入URL连接
ieval.appendUrl('https://image.xxx.com/echarts.js');
ieval.appendUrl('https://image.xxx.com/vue.js');
const ctx = await ieval.getWindow();

// 运行.
ctx.echarts.init();
```

#### iEval 函数
``` javascript
import {iEval} from 'ieval';

// 这个环境变量特别重要，因为它是我们在JS代码中所依赖的系统对象所需要的，比如window global文档
// 如果当前执行的代码不需要系统对象，我们可以将其留空，以避免在执行过程中出现安全问题
const context = {};

// 在上下文中插入URL连接
const ieval = iEval(['console.log("start.")', 'https://image.xxx.com/echarts.js', 'https://image.xxx.com/vue.js','console.log("end.")'], context);

// 然后我们使用'getWindow'来获得在我们执行的代码中声明的全局变量
const ctx = await ieval.getWindow();

// run.
ctx.echarts.init();
```

##### 通过这种方式，我们实现了一个基本的资源加载执行

### 注意事项
* 在当前环境中包含适当的上下文对象非常重要。如果当前环境中没有使用系统对象，我们可以将其设置为{}。