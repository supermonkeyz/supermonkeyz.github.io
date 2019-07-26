---
layout: post
title:  "从0开始搭建一套前端UI组件库 — 01 开篇"
date:   2019-7-20 14:13:41 +0800
categories: fe Vue.js
comments: true
---

<style>
img[alt$="title"] {
  vertical-align: text-bottom;
}
</style>

## 引子

从2017年开始，为了实现UI标准化、提升开发效率、减少维护成本，我便开始一套主要应用于移动端的UI组件库开发。经过两年的实践使用，从开发方式、组件如何设计、如何扩展等等方面收获了一些经验，这些经验可能对一些刚刚接触前端圈的同学们有些许帮助，现在拿出来分享给大家。本系列适合入门前端工程师，有丰富开发经验的大拿可以选择忽略。

<!--more-->

## 思考

在开发之前，你也许会陷入思考，为什么不拿一套成熟的UI组件库修改一番，这样既简单又避免了踩坑，何乐而不为？美滋滋过后，你会突然发现自己这个前端工程师，慢慢的变成了一个乐高工程师，在npm上猎取一个又一个的module，你职责仅仅就是用你掌握的技术把它们一个个的拼接起来，完工之后还要感叹一句真tmd的好用。久而久之你会发现已经被生态奴役，手无缚鸡之力。痛定思痛，作为一个前端工程师得自己做出点出属于自己的东西。

当你下决心着手开发一套UI组件的库，首先该考虑什么？

换台最新款 💻，搭配手感最好的 ⌨️，再来个4K 🖥？

好了不开玩笑了。你该考虑的无非就是`JavaScript`、`CSS`、`HTML`。因为无论是开发工程还是最终产物围绕的不过就是这三大构成。但是深入想想，你会发现基于三大构成我们需要准备的东西还有很多。

## 着手

### ![JavaScript Logo title](https://cdn.worldvectorlogo.com/logos/javascript.svg){:height="36px" width="36px"} 框架选择

在2019年，作为基础的JavaScript library可选择逃不出以下三种：

  - [![Vue Logo](https://cdn.worldvectorlogo.com/logos/vue-9.svg){:height="20px" width="20px"} Vue.js](https://vuejs.org){:target="_blank"}
  - [![React Logo](https://cdn.worldvectorlogo.com/logos/react.svg){:height="20px" width="20px"} React](https://reactjs.org){:target="_blank"}
  - [![Angular Logo](https://cdn.worldvectorlogo.com/logos/angular-icon-1.svg){:height="20px" width="20px"} Angular](https://angular.io){:target="_blank"}

国内来说Vue.js有着众多的开发者。文档、生态、上手难易程度对于一个新手来说都非常友好。从难易程度来讲从`Vue.js`起步是个不错的选择。

### ![CSS Logo title](https://cdn.worldvectorlogo.com/logos/css-5.svg){:height="36px" width="36px"} CSS预编译语言选择

目前市面上主流的CSS预编译语言大体分为：

  - [![PostCSS Logo](https://cdn.worldvectorlogo.com/logos/postcss.svg){:height="20px" width="20px"} PostCSS](https://postcss.org){:target="_blank"}
  - [![Sass Logo](https://cdn.worldvectorlogo.com/logos/sass-1.svg){:height="20px" width="20px"} Sass](https://sass-lang.com){:target="_blank"}
  - [![Less Logo](https://cdn.worldvectorlogo.com/logos/less.svg){:height="20px" width="20px"} Less](http://lesscss.org){:target="_blank"}
  - [![Stylus Logo](https://cdn.worldvectorlogo.com/logos/stylus-1.svg){:height="20px" width="20px"} Stylus](http://stylus-lang.com/){:target="_blank"}

也许你还不太了解任何一门预编译语言，抑或你对CSS预编译并不感冒，觉得CSS实现效果就可以，本身就没什么规律可以遵循。但是我要说你错了。尤其是对于UI组件库，一份合理的CSS前期规划是多么有必要。预编译语言可以帮你快速的应对设计反复无常的变化，帮你节省不必要浪费的时间。这里我选择了`PostCSS`这个新贵，看重的是编译速度以及与"CSS4"千丝万缕的联系。

### ![HTML Logo title](https://cdn.worldvectorlogo.com/logos/html-5.svg){:height="36px" width="36px"} 标签的语义化

长久以来，HTML就不被人广泛关注。HTML5甚至成为了演变成了人们对于最新前端技术的代名词（H5）。但是HTML的存在感真的就那么低吗？或许你该了解以下这些：

- [HTML语义化](https://developer.mozilla.org/zh-CN/docs/Web/Guide/HTML/HTML5#%E8%AF%AD%E4%B9%89)
- [ARIA](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility/ARIA)

HTML虽然服务于幕后，但一份合理的文档结构可以增加UI组件的可读性，真正让你的组件服务于绝大数人包括残障人士，这应该成为我们的追求。


### ![SVG Logo title](https://cdn.worldvectorlogo.com/logos/svg-2.svg){:height="36px" width="36px"} 图标资源选择

这是一个矢量图形的时代，设计师都渐渐的放弃了PhotoShop转战Sketch，在一套现代的UI组件库中的图标资源我想应该都是矢量的：

- [Web fonts](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/%E4%B8%BA%E6%96%87%E6%9C%AC%E6%B7%BB%E5%8A%A0%E6%A0%B7%E5%BC%8F/Web_%E5%AD%97%E4%BD%93)
- [Svg symbol](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/symbol)

`Web fonts` `Svg symbol`这两种不同的矢量技术方案都在我们的UI组件中得以运用，它们会有怎样的不同，我将在后面的文章中慢慢解释。

## 开始

### ![NPM Logo title](https://cdn.worldvectorlogo.com/logos/npm-2.svg){:height="36px" width="36px"} 前端工程配置

当你确定好UI组件库使用的一切技术流之后，恭喜你进入了下一阶段，前端工程配置。这是前端开发过程中非常重要的一个环节，它负责提供一套完整的开发环境、规范审查代码、把它们转换成目前浏览器可正常运行的代码，所以你或许无法摆脱：

- [![Nodejs Logo](https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg){:height="20px" width="20px"} Nodejs](https://nodejs.org){:target="_blank"}
- [![Yarn Logo](https://cdn.worldvectorlogo.com/logos/yarn.svg){:height="20px" width="20px"} Yarn](https://yarnpkg.com){:target="_blank"}
- [![Webpack Logo](https://cdn.worldvectorlogo.com/logos/webpack-icon.svg){:height="20px" width="20px"} Webpack](https://webpack.js.org){:target="_blank"}
- [![Gulp Logo](https://cdn.worldvectorlogo.com/logos/gulp-1.svg){:height="20px" width="20px"} Gulp.js](https://gulpjs.com){:target="_blank"}
- [![Bebal Logo](https://cdn.worldvectorlogo.com/logos/babel-10.svg){:height="20px" width="20px"} Bebal](https://babeljs.io){:target="_blank"}
- [![Eslint Logo](https://cdn.worldvectorlogo.com/logos/eslint-1.svg){:height="20px" width="20px"} Eslint](https://eslint.org){:target="_blank"}
- [![Prettier Logo](https://cdn.worldvectorlogo.com/logos/prettier-2.svg){:height="20px" width="20px"} Prettier](https://prettier.io){:target="_blank"}
- [![PostCSS Logo](https://cdn.worldvectorlogo.com/logos/postcss.svg){:height="20px" width="20px"} PostCSS.parts](https://www.postcss.parts){:target="_blank"}
- ...

一言难尽，还好最新的`Vue CLI`帮我们解决了大部分问题，但我们仍要为了开发做一些自己的配置，所以了解以上列表在所难免。

### ![Apple Logo title](https://cdn.worldvectorlogo.com/logos/apple.svg){:height="36px" width="36px"} 开发工具

工欲善其事，必先利其器。好的编辑工具能够为开发提升更多的效率。大多数开发者可能都会选择：

- [![VSCode Logo](https://cdn.worldvectorlogo.com/logos/visual-studio-code.svg){:height="20px" width="20px"} VSCode](https://code.visualstudio.com){:target="_blank"}
  - Color Highlight
  - ESLint
  - Highlight Trailing White Spaces
  - Markdown All in One
  - Prettier
  - Vetur
  - Vue 2 Snippets
  - ...
- [![Chrome Logo](https://cdn.worldvectorlogo.com/logos/chrome-7.svg){:height="20px" width="20px"} Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en){:target="_blank"}

当配置好以上所需工具后，我们即将开启UI组件的开发之旅。

## 总结

可见开发一套前端UI组件库所需的准备工作并不简单。你需要挑选一套成熟的技术栈、配置一套符合你开发需求的前端工程化环境、熟练掌握CSS、HTML、JavaScript基础知识、了解现代npm模块管理。当你对如上的技术体系有一个较为全面的认识之后，我们才有能力开发好一套前端UI组件。当我们真正开始开发后，你可能会发现需要关注的细节会更多。

那么让我们准备开始吧！🏃🏻