---
layout: post
title:  "从0开始搭建一套前端UI组件库 — 03 全局统筹"
date:   2019-7-25 22:13:41 +0800
categories: fe Vue.js
comments: true
---

开发环境搭建完成后，该站在全局角度考虑一个UI组件库的开发细节了。文件夹结构、文件如何组织、全局适配，全局定义等等这些都是我们要首先解决的问题。当然，一蹴而就并不现实，伴随开发我们可能会不断进行修正，为的就是能够更好的组织一套相对成熟的组件体系。

<!--more-->

## 目录

经过之前的一顿操作猛如虎，目前项目结构：

```
.
├── dist                  // 最终产物地址
├── components            // 组件文件夹
├── public                // 站点入口文件夹
├── src                   // 示例文件夹
├── .eslintrc.js          // eslint配置文件
├── .postcssrc.js         // postcss配置文件
├── .prettierrc.js        // prettier配置文件
├── babel.config.js       // babel配置文件
├── LICENSE               // LICENSE文件
├── package.json          // package.json
├── vue.config.js         // webpack配置文件
└── yarn.lock             // 模块版本控制
```

将`📂components`作为组件库文件夹。

先来看`📂components`目录里面的规划：

```
.
└── _style                // 存放全局CSS文件
    └── const.css         // 比如说全局CSS变量
    └── ...
└── _util                 // 存放全局JS文件
    └── xxx.js
    └── ...
└── _mixin                 // 存放mixin文件
    └── xxx.js
    └── ...
└── _directive             // 存放directive文件
    └── xxx.js
    └── ...
└── ...
└── component1            // 组件1文件夹(component1是举例)
    └── component1.vue    // 组件vue文件
    └── index.js          // 组件入口文件
└── ...
├── index.js              // 所有组件入口文件
```

## 组件文件

先看看单个component包含的东西：如果是单组件那么文件夹包含一个component.vue文件，一个index.js导出文件，组件组会包含多个vue文件。

### .vue文件：

**模板代码**

``` html
<template lang="html">
  <div :class="$style.main">
  </div>
</template>
```

**脚本代码**

``` html
<script>
export default {
  name: 'yo-button',
  props: {}
};
</script>
```

**样式代码**

``` html
<style lang="postcss" module>
/* 属性值定义 */
:root {
}

.main {
}
</style>
```

### .js文件

单组件

``` js
// 引入vue文件
import Component from './component';
// 注册插件
Component.install = function(Vue) {
  Vue.component(Component.name, Component);
};
// 导出组件
export default Component;
```

组件组

``` js
// 引入vue文件
import Component from './component';
import ComponentItem from './component-item';
// 注册插件
Component.install = function(Vue) {
  Vue.component(Component.name, Component);
};
ComponentItem.install = function(Vue) {
  Vue.component(ComponentItem.name, ComponentItem);
};
// 导出组件
export { Component, ComponentItem };
```

## 全部组件集

将开发的全部组件放入一个入口文件，最终打包这个文件，得到的就是整个组件库文件。

``` js
// 单组件
import Component from './component';
// 组件组
import * as ComponentGroup from './component-group'

const components = {
  Component,
  ...ComponentGroup
};

// 注册所有组件
const YoUI = {
  install(Vue) {
    Object.keys(components).forEach(key => {
      Vue.component(Component[key].name, Component[key]);
    });
  }
};

// 导出所有组件
export {
  YoUI as default,
  Component,
  ComponentGroup
};

// CDN引用方式直接调用
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(YoUI);
}
```

## 组件示例

组件注册完成了，那怎么检测组件调用后展示的形态呢？

众多选择：

* 直接在src里面main.js调用
* 使用[stroybook](https://storybook.js.org){:target="_blank"}展示组件
* 使用[Vue Styleguidist](https://vue-styleguidist.github.io){:target="_blank"}展示组件
* ……

我们选择比较简单友好的Vue Styleguidist，
使用`vue-cli-plugin-styleguidist`可以快速搭建出这套套文档系统，当一切完成后，在组件中做好注释，props、event、slot等会自动提取成为文档的一部分。在component文件夹内添加Readme.md，在md文件中加入组件示例。最后一切内容都会呈现在生成的页面之中。

## 单个组件文件夹

那么最终单个组件的文件夹就包含了

```
└── component1
    └── component1.vue
    └── ....vue
    └── index.js
    └── Readme.md
```

## 自动初始化组件

开发环境、文件目录以及所需文件都已规划完毕。通过梳理，可以发现一个组件需要的文件如果通过脚本创建既快捷又规范，能让我们把工作重心完全放到组件本身的开发。

在项目根目录创建一个`📂bin`目录新建一个脚本文件create.js，这个脚本负责新建组件文件。

在package.json的scripts里面增加执行脚本`"yo-create": "./bin/create.js"`，

我们试着初始化一个button组件：

``` bash
yarn yo-create button
```

![创建组件](/images/ui-framework/03_01.jpg)

确认创建之后，脚本会自动创建所有组件文件：

![创建组件](/images/ui-framework/03_02.jpg)

然后会创建一个`components.json`文件，对应所有组件以及对应的文件：

``` json
{
  "Button": "./button"
}
```

不要小看这个json文件，依赖这个文件我们用创建的第二个入口模板entry.js，可以快速生成整个组件库的入口文件。


在package.json的scripts里面增加执行脚本`"yo-entry": "./bin/entry.js"`

``` bash
yarn yo-entry
```

![构建入口](/images/ui-framework/03_03.jpg)

## 组件预览

刚刚我们创建好了一个button组件，我们试着加入一些代码来测试预览组件的输出效果：

### 修改button.vue

``` html
<button :class="$style.main" @click="clickHandle">
  <!-- @slot default slot -->
  <slot />
</button>
```
``` js
export default {
  props: {
    /**
     * The kind for the button.
     * `default: line, flat, simple`
     */
    kind: {
      type: String,
      default: 'line'
    }
  },
  methods: {
    clickHandle() {
      /**
       * Click event.
       */
      this.$emit('click');
    }
  }
};
```
``` css
.main {
  border: 1px solid gray;
}
```

### 修改一下Readme.md

~~~ md
## Basic use
``` vue
  <yo-button>default</yo-button>
```
~~~

### 运行预览命令

``` bash
yarn styleguide
```

浏览器我们看到了修改的结果

![预览效果](/images/ui-framework/03_05.jpg)

## 组件构建

最后要再处理一下组件打包的问题，上一篇简单说了打包问题。现在我们更贴近需求优化一下打包脚本。刚刚生成的components.json的另一个作用就是对组件列表内的单个组件分别打包。`📂bin`目录创建一个pack.js负责框架文件输出。借助vue-cli-service 对每个构建目标进行构建可以分别得到所需要框架文件。

``` bash
yarn yo-pack
```

![打包成功](/images/ui-framework/03_04.jpg)

### Cli服务

`package.json`script的指令，在bin字段注册后，通过`yarn link`或者`npm link`,可以注册全局的指令。这样使用：

``` bash
yo-ui-create button
```

npm bin详细内容可见[官方文档](https://docs.npmjs.com/files/package.json#bin){:target="_blank"}

*注册bin的时候，js脚本头部要添加注释： #!/usr/bin/env node*

*脚本文件可能会存在权限问题 必要时用chmod 755 filename修改权限*


本篇文章所有代码部署在article_03分支：

[yo-ui/article_03](https://github.com/supermonkeyz/yo-ui/tree/article_03){:target="_blank"}