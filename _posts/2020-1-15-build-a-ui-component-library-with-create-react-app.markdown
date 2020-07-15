---
layout: post
title:  "2020 Create React App 开始一个UI组件库"
date:   2020-1-15 13:28:41 +0800
categories: fe React
comments: true
---

是什么驱使我准备用[Create React App](https://create-react-app.dev/docs/getting-started/)^[之后简称CRA] (后文简称CRA)来开发一套UI Component Library呢？因为团队选用了Vue作为基础技术栈，之前习惯了官方开箱即用的[Vue-CLI](https://cli.vuejs.org)非常便捷即可配置完成构建组件库所需的生产环境，比如这套我们内部使用的[wooui-pro](https://uxfan.com/wooui/pro),基于CLI约定配置后便迅速产出了符合团队标准的组件。那么使用React官方提供的CRA，我们是否也能快速打造出标准化的组件库呢？带着疑问开始了探索之旅。

<!--more-->

![Banner](/images/cra2020/banner.png)

## 引子

是什么驱使我准备用[Create React App](https://create-react-app.dev/docs/getting-started/)^[之后简称CRA] (后文简称CRA)来开发一套UI Component Library呢？因为团队选用了Vue作为基础技术栈，之前习惯了官方开箱即用的[Vue-CLI](https://cli.vuejs.org)非常便捷即可配置完成构建组件库所需的生产环境，比如这套我们内部使用的[wooui-pro](https://uxfan.com/wooui/pro),基于CLI约定配置后便迅速产出了符合团队标准的组件。那么使用React官方提供的CRA，我们是否也能快速打造出标准化的组件库呢？带着疑问开始了探索之旅。

## 目标

之前总结过一个使用Vue技术栈的环境配置指南，大家感兴趣可以戳👉[这里](https://uxfan.com/fe/vue.js/2019/07/22/build-frontend-ui-framework-from-very-beginning_02.html)

我们核心目标意在配置一个类Vue-CLI体验的基于CRA的React UI Component Library。

## 需求

既然设定了目标，我们应该明确一下我们完成这个目标的需求点 (是的，人人都是产品经理，🐶保命)

- CRA作为基础脚手架且不eject
- 使用[CSS Modules](https://github.com/css-modules/css-modules)管理CSS类名
- 可配置[postcss](https://postcss.org/)预编译插件
- 配置代码校验工具保证代码标准化
- 迅速生成组件示例以及文档
- 可以Build出一个library包用于发布

基于这些需求，我们将逐个解决完成这些需求所遇到的问题。

## 开始

### CRA项目初始化

首先要做的就是使用CRA创建项目，一行代码就完成了项目初始化

```bash
npx create-react-app my-app
```

项目文件结构如下，那是相当简洁，甚至都怀疑进错了目录...

```
my-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    └── serviceWorker.js
```

Create React App 顾名思义创建一个React应用，完全标准化的脚手架。

于是，试着引入CSS Modules，按照文档

#### Button.module.css

```css
.error {
  background-color: red;
}
```

#### Button.js

```jsx
import React, { Component } from 'react';
import styles from './Button.module.css'; // Import css modules
class Button extends Component {
  render() {
    // reference as a js object
    return <button className={styles.error}>Error Button</button>;
  }
}
```

#### 结果

```
<button class="Button_error_ax7yz">Error Button</button>
```

**Button_error_ax7yz** 黑人问号.jpg！ 不能忍受一个组件库CSS类名带着md5。找了半天文档发现根本没有给你改CSS Modules命名规则的地方啊。那么要是想改这个规则的话怎么办呢？了解的人可能知道CSS Modules是[css-loader](https://github.com/webpack-contrib/css-loader)提供支持的，那么现在需要不eject CRA，还要把css-loader的配置项修改了，有招吗？

### React App Rewired配置Webpack

本着能用现成的就别自己动手的宗旨🤦，Google到了[React App Rewired](https://github.com/timarney/react-app-rewired)这个神器，而且还有中文的说明：

>此工具可以在不 'eject' 也不创建额外 react-scripts 的情况下修改 create-react-app 内置的 webpack 配置，然后你将拥有 create-react-app 的一切特性，且可以根据你的需要去配置 webpack 的 plugins, loaders 等。

这正是我们所需要的，依赖它们就可以修改css-loader配置了。

#### 安装react-app-rewired

```bash
yarn add react-app-rewired --dev
```
#### 在项目根目录中创建一个 config-overrides.js 文件

```js
/* config-overrides.js */
module.exports = {
    webpack: function(config, env) {
        // 这里修改config
        // react-app-rewired拦截后修改配置，然后按照配置进行脚本构建
        return config;
    }
}
```

#### 修改package.json中的脚本指令

```json
/* package.json */

  "scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
  }
```

#### 修改css-loader配置

查找react-app-rewired文档，发现修改CSS Modules有对应的loader：

* [react-app-rewire-css-modules](https://github.com/codebandits/react-app-rewire-css-modules) by [@lnhrdt](https://github.com/lnhrdt)
* [react-app-rewire-css-modules-extensionless](https://github.com/moxystudio/react-app-rewire-css-modules-extensionless) by [@moxystudio](https://github.com/moxystudio)

不过发现这两个loader扩展貌似都不太适合现在版本的CRA了(现版本CRA已经支持CSS Modules，我的诉求是修改配置)。

不过我们可以借鉴代码，借鉴代码的同时我们还可以看看我们劫持的react-scripts的webpack配置到底是怎样的，文件就在`node_modules/react-scripts/config/webpack.config.js`。

1. 项目根目录新建个scripts目录存放修改CSS Modules的脚本cssModuleConfig.js，直接贴出源码：

```js
/* scripts/cssModuleConfig.js */
const path = require('path');
const ruleChildren = loader =>
  loader.use || loader.oneOf || (Array.isArray(loader.loader) && loader.loader) || [];
const findIndexAndRules = (rulesSource, ruleMatcher) => {
  let result = undefined;
  const rules = Array.isArray(rulesSource) ? rulesSource : ruleChildren(rulesSource);
  rules.some(
    (rule, index) =>
      (result = ruleMatcher(rule)
        ? { index, rules }
        : findIndexAndRules(ruleChildren(rule), ruleMatcher))
  );
  return result;
};
const findRule = (rulesSource, ruleMatcher) => {
  const { index, rules } = findIndexAndRules(rulesSource, ruleMatcher);
  return rules[index];
};
const cssRuleMatcher = rule =>
  rule.test && String(rule.test) === String(/\.module\.css$/);
const sassRuleMatcher = rule =>
  rule.test && String(rule.test) === String(/\.module\.(scss|sass)$/);

const createLoaderMatcher = loader => rule =>
  rule.loader && rule.loader.indexOf(`${path.sep}${loader}${path.sep}`) !== -1;
const cssLoaderMatcher = createLoaderMatcher('css-loader');
const sassLoaderMatcher = createLoaderMatcher('sass-loader');

module.exports = function(config, env, options) {
  const cssRule = findRule(config.module.rules, cssRuleMatcher);
  let cssModulesRuleCssLoader = findRule(cssRule, cssLoaderMatcher);
  const sassRule = findRule(config.module.rules, sassRuleMatcher);
  let sassModulesRuleCssLoader = findRule(sassRule, sassLoaderMatcher);
  cssModulesRuleCssLoader.options = { ...cssModulesRuleCssLoader.options, ...options };
  sassModulesRuleCssLoader.options = { ...sassModulesRuleCssLoader.options, ...options };
  return config;
};
```
这么一坨代码其实就是找到对应loader，然后修改里面的options属性。

2. 在config-overrides.js中修改CSS Modules的配置:

```js
/* config-overrides.js */
const cssModuleConfig = require('./scripts/cssModuleConfig');
const loaderUtils = require('loader-utils');

module.exports = {
  webpack: function(config, env) {
    // 配置className按照namespace-folderName-localName的形式输出
    config = cssModuleConfig(config, env, {
      modules: {
        getLocalIdent: (context, localIdentName, localName, options) => {
          const folderName = loaderUtils.interpolateName(context, '[folder]', options);
          const className =
            process.env.LIB_NAMESPACE + '-' + folderName + '-' + localName;
          return className.toLowerCase();
        }
      }
    });
    return config;
  }
};
```

#### 结果验收
##### Button.module.css
```css
.main {
    border: 1px solid;
}
```

##### Button.js

```jsx
import styles from './Button.module.css'; // Import css modules
<button className={styles.main}>Button</button>
```

##### 结果

```html
<button class="woo-button-main">Button</button>
```

第一步么表达成！接下来应该是要各个组件的构建之路了，组件众多，既要逐个展示还要罗列说明，如果按部就班完成，那要消耗不少精力。有没有方法简化这个流程呢？下面就要祭出又一神器:

### React Styleguidist生成组件示例

[🐙React Styleguidist](https://react-styleguidist.js.org/)可以帮助我们轻松解决属性自动生成、组件状态展示、文档说明等等问题，让我们能把精力完全放到组件开发上。

#### 安装react-styleguidist

```bash
yarn add react-styleguidist --dev
```

#### src目录建立components目录

```
...
└── src
    ├── components
        ├── Button
            ├── Button.module.css //CSS
            ├── index.js          //Button组件入口
            ├── Readme.md         //示例说明
...
```

#### 修改package.json中的指令

```json
/* package.json */

  "scripts": {
-   "start": "react-app-rewired start",
+   "start": "styleguidist server",
  }
```

#### 🚀发射

命令行运行`yarn start`，静待‘奇迹’发生...

（运行结果基于Button组件已经写了[部分代码](https://github.com/supermonkeyz/wooui-react/tree/master/src/components/Button)）

![React Styleguidist Button Component](/images/cra2020/styleguidist.png)

美如画~ 不，等等，检查元素的时候我刚配置的类名规则怎么又变回来了？仔细想想才发现Styleguidist加载的webpack配置是CRA提供的，那肿么办呢？我们得想办法让Styleguidist调用Rewired来工作，这样`react-app-rewired start`发生的一切才会在`styleguidist server`上发生。可以吗？当然！

#### 配置Styleguidist

通过新建styleguide.config.js文件，完成调用react-app-rewired配置

```js
/* styleguide.config.js */
const { paths } = require('react-app-rewired');
const overrides = require('react-app-rewired/config-overrides');
const config = require(paths.scriptVersion + '/config/webpack.config');

module.exports = {
  webpackConfig: overrides.webpack(config(process.env.NODE_ENV), process.env.NODE_ENV)
};
```

#### 🚀再次发射

命令行运行`yarn start`，CSS Modules配置生效，美滋滋。


### 配置postcss

这两年一直在用postcss这个CSS预编译工具。一方面postcss面向未来的CSS标准，二来插件随用随装，比一次装个node-sass快了不知道多少。配置postcss的文件可以有N种方式，往常的往项目根目录新建个`postcss.config.js`，[postcss-loader](https://github.com/postcss/postcss-loader)读取配置，按照插件顺序完成编译过程。于是配置个[postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)。


#### postcss.config.js
```js
/* postcss.config.js */
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16,
      propWhiteList: [
        '*',
        '!border',
        '!border-top',
        '!border-right',
        '!border-bottom',
        '!border-left',
        '!border-width'
      ],
      selectorBlackList: ['html'],
      mediaQuery: false
    }
  }
};
```

#### Button.module.css
```css
.main {
    font-size: 16px;
}
```

#### 结果
```css
.woo-button-main {
    font-size: 16px;
}
```

预期结果并有发生，原来CRA也并没有postcss-loader选项，看来还是需要借助Rewired

### Rewired Postcss

#### 安装react-app-rewire-postcss

[react-app-rewire-postcss](https://github.com/csstools/react-app-rewire-postcss)试了一下可以正常使用，我们根据文档配置一下config-override.js

```js
/* config-override.js */
...
const rewirePostcss = require('react-app-rewire-postcss');

module.exports = {
  webpack: function(config, env) {
    ...
    config = rewirePostcss(config, true);
    return config;
  }
};
```

#### Button.module.css
```css
.main {
    font-size: 16px;
}
```

#### 结果
```css
.woo-button-main {
    font-size: 1rem;
}
```

Done! 下面可以继续开始愉快Coding了~，为了让编码标准规范，需要借助工具来约束。

### 规范代码

代码检查借助[Prettier](https://prettier.io)以及[ESLint](https://eslint.org)的扩展，[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)将关闭所有不必要的或可能与Prettier冲突的规则。[eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)则是添加Prettier格式设置规则的插件。

#### 安装

```bash
yarn add prettier eslint-config-prettier eslint-plugin-prettier --dev
```

#### ESLint配置

新建.eslintrc文件
```json
{
  "extends": ["react-app", "plugin:prettier/recommended"]
}
```

#### Prettier配置

新建.prettierrc文件
```json
{
  "printWidth": 90,
  "singleQuote": true,
  "semi": true
}
```

#### 配置git提交校验

接下来配置[Husky](https://github.com/typicode/husky#readme) 与 [Lint Staged](https://github.com/okonet/lint-staged)来确保每次提交代码的正确性

```bash
yarn add husky lint-staged --dev
```

修改package.json

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{js,jsx,json,css,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

回头看看开始制定的目标，只剩下最终最关键一步，将UI Components构建成为一个Library。


### 构建库

CRA只提供了开发与构建应用的功能，并没有构建Library的能力。这时候又要祭出React App Rewired这个利器，在文档里面找到的[react-app-rewire-create-react-library](https://github.com/osdevisnot/react-app-rewire-create-react-library)让人眼前一亮，可惜并不好用，所以又不得不改造一个自己的代码来构建组件库。

#### 配置环境变量

创建一个自定义的Library环境变量

1. 首先安装 [env-cmd](https://www.npmjs.com/package/env-cmd)

```bash
 yarn add env-cmd --dev
````

2. 创建环境变量文件.env.library

```
REACT_APP_NODE_ENV = "library"
```

3. 修改package.json

```json
{
    "scripts": {
        "build:library": "rm -rf build && env-cmd -f .env.library react-app-rewired build"
    }
}
```

4. 配置入口文件

```js
/* src/index.js */
import Button from './components/Button';;
export { Button };
```

5. package.json指定es module入口与main入口

```json
{
    "module": "./src/index.js",
    "main": "./build/wooui-react.js"
}
```

#### 构建脚本

构建库配置核心思路是将生产环境构建所做的诸如code splitting、md5文件名、修改模板html这些步骤全部省略，然后配置好output属性参数。

1. 在scripts目录存新建打包脚本reactLibraryConfig.js：

```js
/* scripts/reactLibraryConfig.js */
module.exports = function(config, env, options) {
  // 当值为library的时候，修改配置
  if (env === 'library') {
    const srcFile = process.env.npm_package_module || options.module;
    const libName = process.env.npm_package_name || options.name;
    config.entry = srcFile;
    // 构件库信息
    config.output = {
      path: path.resolve('./', 'build'),
      filename: libName + '.js',
      library: libName,
      libraryTarget: 'umd'
    };
    // 修改webpack optimization属性，删除代码分割逻辑
    delete config.optimization.splitChunks;
    delete config.optimization.runtimeChunk;
    // 清空plugin只保留构建CSS命名
    config.plugins = [];
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: libName + '.css'
      })
    );
    // 代码来自 react-app-rewire-create-react-library
    // 生成externals属性值，排除外部扩展，比如React
    let externals = {};
    Object.keys(process.env).forEach(key => {
      if (key.includes('npm_package_dependencies_')) {
        let pkgName = key.replace('npm_package_dependencies_', '');
        pkgName = pkgName.replace(/_/g, '-');
        // below if condition addresses scoped packages : eg: @storybook/react
        if (pkgName.startsWith('-')) {
          const scopeName = pkgName.substr(1, pkgName.indexOf('-', 1) - 1);
          const remainingPackageName = pkgName.substr(
            pkgName.indexOf('-', 1) + 1,
            pkgName.length
          );
          pkgName = `@${scopeName}/${remainingPackageName}`;
        }
        externals[pkgName] = `${pkgName}`;
      }
    });
    config.externals = externals;
  }
  return config;
};
```

#### 调用构建脚本

下面又要请出React App Rewired，使用刚刚完成reactLibraryConfig，取到修改后的config属性。最后目前完整的代码如下

```js
/* config-overrides.js */

const cssModuleConfig = require('./scripts/cssModuleConfig');
const loaderUtils = require('loader-utils');
const reactLibraryConfig = require('./scripts/reactLibraryConfig');
const rewirePostcss = require('react-app-rewire-postcss');

module.exports = {
  webpack: function(config, env) {
    // 配置CSS Modules
    config = cssModuleConfig(config, env, {
      modules: {
        getLocalIdent: (context, localIdentName, localName, options) => {
          const folderName = loaderUtils.interpolateName(context, '[folder]', options);
          const className =
            process.env.LIB_NAMESPACE + '-' + folderName + '-' + localName;
          return className.toLowerCase();
        }
      }
    });
    // 配置Postcss
    config = rewirePostcss(config, true);
    // 配置构建信息
    // 当执行 yarn build:library时 process.env.REACT_APP_NODE_ENV值为library
    config = reactLibraryConfig(config, process.env.REACT_APP_NODE_ENV);
    // 传给 react-app-rewired 的最终配置清单
    return config;
  }
};
```

#### 清理public目录

CRA在生产构建时会将public目录内容全部拷贝到build目录，所以这个文件夹只保留index.html就可以了。

#### 🛰️👨‍🚀 顺利着陆

```bash
yarn build:library
```

```
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  2.83 KB  build/wooui-react.js
  684 B    build/wooui-react.css
```

`build`文件目录，看到两位小伙伴在向我们招手~

## 总结

终于，按照既定目标，实现了动手前所提出的所有需求。由一个是能否按照Vue-CLI的构建流程快速搭建一个基于React的UI组件库的想法。按照起初的需求，一步步的挖掘解决方案，遇到问题困难，明确自己要处理的核心问题，理清解决思路，找到解决方案，然后再进一步的丰满需求，这样最终实现了不eject CRA构建UI Component目标。

再仔细想想，是不是还有很多东西可以优化呢？比如单个组件文件的创建、整个入口文件的生成、单个组件的构建等等

这个问题如此，生活工作学习其他许多，何尝不是如此？

好了， 谢谢观看，我们下次见。

哦，对了，项目源码放在这里：

<svg version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 x="0px" y="0px" viewBox="0 0 2350 2314.8" xml:space="preserve" width="16" height="16">
<path d="M1175,0C525.8,0,0,525.8,0,1175c0,552.2,378.9,1010.5,890.1,1139.7c-5.9-14.7-8.8-35.3-8.8-55.8v-199.8H734.4
	c-79.3,0-152.8-35.2-185.1-99.9c-38.2-70.5-44.1-179.2-141-246.8c-29.4-23.5-5.9-47,26.4-44.1c61.7,17.6,111.6,58.8,158.6,120.4
	c47,61.7,67.6,76.4,155.7,76.4c41.1,0,105.7-2.9,164.5-11.8c32.3-82.3,88.1-155.7,155.7-190.9c-393.6-47-581.6-240.9-581.6-505.3
	c0-114.6,49.9-223.3,132.2-317.3c-26.4-91.1-61.7-279.1,11.8-352.5c176.3,0,282,114.6,308.4,143.9c88.1-29.4,185.1-47,284.9-47
	c102.8,0,196.8,17.6,284.9,47c26.4-29.4,132.2-143.9,308.4-143.9c70.5,70.5,38.2,261.4,8.8,352.5c82.3,91.1,129.3,202.7,129.3,317.3
	c0,264.4-185.1,458.3-575.7,499.4c108.7,55.8,185.1,214.4,185.1,331.9V2256c0,8.8-2.9,17.6-2.9,26.4
	C2021,2123.8,2350,1689.1,2350,1175C2350,525.8,1824.2,0,1175,0L1175,0z"/>
</svg> [wooui-react](https://github.com/supermonkeyz/wooui-react)
