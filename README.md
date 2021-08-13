<p align="center">
  <a href="https://github.com/tang-haibo/remote-import/actions/workflows/deploy.yml/badge.svg">
    <img src="https://github.com/tang-haibo/remote-import/actions/workflows/deploy.yml/badge.svg" alt="Build Status">
  </a>
  <a href='https://coveralls.io/github/tang-haibo/remote-import?branch=master'><img src='https://coveralls.io/repos/github/tang-haibo/remote-import/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>
<h2 align="center">微信小程序远程代码加载工具</h2>

```
// 导入
import {DocumentEval} from 'ieval';
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

```
### 注意事项(当前已测试 ec-canvas 内的echarts大文件替换)
1. 当前仅支持使用，如相关库使用到document等关键字请自行实现，以下是基于echarts实现大致demo
2. 改方法主要处理代码执行， 上下文对象由使用方自行实现
3. 支持传入直接 js 代码，代码加载路径以及 babel/parser 相关的ast代码树
```
const context = {
  global,
  setTimeout,
  document: {
    createElement(tag) {
    }
  },
};
const mod = new DocumentEval(context);
mod.appendUrl('https://image.cashier.42bk.com/1/echarts.js');
const ctx = await mod.getWindow();
function initChart(canvas, width, height, dpr) {
  return mod.getWindow().then(({echarts}) => {
  // return Promise.resolve().then(() => {
    chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    
    canvas.setChart(chart);
  
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        },
        confine: true
      },
      legend: {
        data: ['热度', '正面', '负面']
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 15,
        top: 40,
        containLabel: true
      },
      xAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#666'
          }
        }
      ],
      series: [
        {
          name: '热度',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          data: [300, 270, 340, 344, 300, 320, 310],
          itemStyle: {
            // emphasis: {
            //   color: '#37a2da'
            // }
          }
        },
        {
          name: '正面',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true
            }
          },
          data: [120, 102, 141, 174, 190, 250, 220],
          itemStyle: {
            // emphasis: {
            //   color: '#32c5e9'
            // }
          }
        },
        {
          name: '负面',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'left'
            }
          },
          data: [-20, -32, -21, -34, -90, -130, -110],
          itemStyle: {
            // emphasis: {
            //   color: '#67e0e3'
            // }
          }
        }
      ]
    };
    // 模拟创建canvas行为
    context.document.createElement = function() {
      return canvas;
    }
    chart.setOption(option);
    return chart;
  });  
}
```