---
layout: post
title:  "从0开始搭建一套前端UI组件库 — 02 环境搭建"
date:   2019-7-22 22:13:41 +0800
categories: fe Vue.js
comments: true
---

一直以来前端开发都需要花费大量时间进行环境配置，一系列操作目的无非是为了提升开发效率、标准化开发流程、提升代码可执行性等等。所以一个可持久的项目合理的环境配置，以及根据开发需求不断的进行修改优化，是非常有必要的。那么这一篇就主要谈谈开发这套UI组件库前端环境的搭建。

<!--more-->

## CLI

使用官方[Vue-CLI](https://cli.vuejs.org/zh/guide/installation.html)服务可以减少不必要的环境配置时间

``` shell
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

确认好Vue-CLI已经安装成功

``` shell
vue --version
3.9.3
```

初始化项目，我们把UI组件库取名为yo-ui

``` shell
vue create yo-ui
```

选择Manually select features，可以看到如下选项，开发组件库最基本的除了Babel与Linter以外，我们可以暂时不需要。

![Vue 创建一个项目](/images/ui-framework/02_01.jpg)

在Linter / Formatter那个选项，选择ESLint + Prettier保证项目的代码尽可能规范。

``` shell
? Pick a linter / formatter config:
  ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
❯ ESLint + Prettier
```

保证配置文件在`dedicated config files`。如果你使用的是3.9.3这个版本，也许你会遇到报错

``` shell
Error: Failed to load plugin prettier: Cannot find module 'eslint-plugin-prettier'
```

这个问题的解决方案[#4310](https://github.com/vuejs/vue-cli/issues/4310){:target="_blank"}

## 开始

最基础的开发环境就算搭建好了，这时候如果执行

``` shell
npm run serve
# OR
yarn serve
```

会出现很多警告，这是因为遵循代码规范不同造成的。

我们可以在.prettierrc.js里面配置

``` javascript
module.exports = {
  singleQuote: true
};
```

CLI会帮你创建几个示例文件，这些在我们的项目中并不需要，我们可以先删掉HelloWorld.vue，修改App.vue与main.js，保证项目在运行时不再⚠️，这时候项目终于健康的运转起来了，当然工作还远远没有结束。

## CSS

### 命名

长久以来，由于CSS没有作用域，如果没有一个严格的命名的规则，那么在一个项目中势必存在着各种冲突的可能。所以很多解决方案被提出解决这个问题。[BEM](http://getbem.com/introduction/){:target="_blank"}、[SUIT](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md){:target="_blank"}、[Scoped](https://vue-loader.vuejs.org/guide/scoped-css.html)…… 我们要选择的则是[CSS Modules](https://vue-loader.vuejs.org/guide/css-modules.html){:target="_blank"}，它能很好的统一dom上的classname以及对应生成的class。

我们首先要做是确定一个类名构成规则，我们新建一个命名为vue.config.js的Vue-CLI配置文件，然后对类名进行配置。

类名结构定义为：

``` css
.namespace-filename-localclass {}
/* 比如一个按钮 对应的class可能就是这样*/
.y-button-default {}
```

在vue.config.js中做如下配置：

``` javascript
module.exports = {
  css: {
    loaderOptions: {
      css: {
        localIdentName: 'y-[name]-[local]',
        camelCase: 'only'
      }
    }
  }
}
```

现在可以在App.vue尝试一下：

``` html
<template>
  <div :class="$style.title">标题</div>
</template>

<style lang="postcss" module>
.title {
  color: black;
}
</style>
```

编译执行后：

``` html
<div class="y-App-title">测试</div>

<style>
.y-App-title {
  color: black;
}
</style>
```

这样基本满足了我们对于样式命名的要求，那么是不是可以将`.y-App-title`中大写转成小写呢？vue-loader的issue[#734](https://github.com/vuejs/vue-loader/issues/734){:target="_blank"}中Evan You回答了这个问题。所以目前css-loader的getLocalIdent还不能派上用场。

### PostCSS配置

PostCSS插件是需要单独配置的，在日常开发中最频繁的需求就是CSS单位转换了，通过[postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem){:target="_blank"}我们可以轻松解决这个问题。

``` shell
yarn add postcss-pxtorem --dev
```

配置postcssrc.js

``` javascript
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16 //基准字号16,
      propWhiteList: [
        '*',
        '!border',
        '!border-top',
        '!border-right',
        '!border-bottom',
        '!border-left',
        '!border-width'
      ] //border属性不进行单位转换,
      selectorBlackList: ['html'] //html标签不进行单位转换,
      mediaQuery: false
    },
    ...
  }
};
```

在之前的.title上测试一下

``` css
<style lang="postcss" module>
.title {
  color: black;
  font-size: 32px;
  border-bottom: 1px;
}
</style>
```

编译后

``` css
<style>
.y-App-title {
  color: black;
  font-size: 2rem;
  border-bottom: 1px;
}
</style>
```

常用的PostCSS插件还有[postcss-preset-env](https://preset-env.cssdb.org/){:target="_blank"}，(或许你听说过它的前身cssnext)。它提供了未来CSS语法的支持，并且跟Babel一样分成了若干stage。

``` shell
yarn add postcss-preset-env --dev
```

``` javascript
module.exports = {
  plugins: {
    …
    'postcss-preset-env': {
      stage: 0
    }
    …
  }
}
```

在之前的.title上测试一下

``` css
<style lang="postcss" module>
.title {
  color: black;
  font-size: 32px;
  border-bottom: 1px;
  font-family: system-ui;
}
</style>
```

编译后

``` css
<style>
.y-App-title {
  color: black;
  font-size: 2rem;
  border-bottom: 1px;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
}
</style>
```

CSS就先配置这么多，随着开发的推进，我们可能还会增加其他的配置。

## Eslint

在项目中为了方便调试，console与debugger再所难免，所以在开发环境要为它们放行。在.eslintrc.js中增加两条规则。

``` javascript
rules: {
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
}
```

## 校验提交

为了防止将不规范的代码提交至git仓库，有必要做一些提交限制

package.json中加入

``` json
"gitHooks": {
  "pre-commit": "lint-staged"
},
"lint-staged": {
  "*.{js,vue}": [
    "vue-cli-service lint",
    "git add"
  ]
}
```

## 构建

Vue-CLI 3提供了很方便[构建库](https://cli.vuejs.org/zh/guide/build-targets.html#%E5%BA%93){:target="_blank"}的方式:

```
# 全局服务
vue-cli-service build --target lib --name myLib [entry]
# 项目内
npx vue-cli-service build --target lib --name myLib [entry]
```

新建一个package的文件夹和一个index.js的入口文件

在package.json的script加入一条指令:

``` json
"package": "vue-cli-service build --target lib --name yo-ui ./package/index.js"
```

在终端中输入：
``` shell
yarn package
```

![库打包](/images/ui-framework/02_02.jpg)

## 总结

至此，一套简单的开发环境的架子搭建的差不多了。我们熟悉了用Vue-CLI 3初始化，又针对项目进行了自定义配置，规范了项目、确认了大部分开发构建流程。接下来我们就准备进入正题，开始正式的开发之旅。

本篇文章所有代码部署在article_02分支：

[yo-ui/article_02](https://github.com/supermonkeyz/yo-ui/tree/article_02){:target="_blank"}