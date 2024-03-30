---
layout: post
title:  "CSS实现渐变描边"
date:   2024-3-30 14:09:41 +0800
categories: CSS snippet
comments: true
---

如果用CSS实现一个渐变描边，同时保证可以实现圆角效果呢？

<!--more-->

一种实现方式，可以巧妙使用transparent border，配合背景渐变色来实现。

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="rNbGrXX" data-user="weibobuilder" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/weibobuilder/pen/rNbGrXX">
  gradient border</a> by Chan Xiaoye (<a href="https://codepen.io/weibobuilder">@weibobuilder</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

甚至，我们可以增加一些动画，让描边更加活泼

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="JjVraGX" data-user="weibobuilder" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/weibobuilder/pen/JjVraGX">
  gradient animate border</a> by Chan Xiaoye (<a href="https://codepen.io/weibobuilder">@weibobuilder</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
