---
layout: post
title:  "Highlight 测试"
date:   2016-1-20 11:47:41 +0800
categories: jekyll
---

{% highlight scss %}
.box{ 
  color: $cl-c;
  font-size: $f12;
}
{% endhighlight%}

{% highlight scss %}
.#{$button}{
    text-align: center;
    line-height:P2R(40px);
    height: P2R(40px);
    font-size:$f14;
    border-radius: P2R(3px);
    outline: 0;
    display: inline-block;
    min-width: P2R(70px);
    box-sizing:border-box;
    padding: 0;
    &.#{$button}-block{
      width: 100%;
      display: block;
    }
}

/*需要依次填写按钮名称 文字色 背景色 边框大小 边框颜色 激活色 激活边框*/
$btn-types: (
  (red  #fff  linear-gradient(to bottom, #f73b3b 0%,#f83232 100%) 0 transparent   linear-gradient(to bottom, #d93434 0%,#d92b2b 100%)  transparent)
  (green  #fff  linear-gradient(to bottom, #18b52a 0%,#10b524 100%)  0 transparent   linear-gradient(to bottom, #149623 0%,#0e961e 100%)  transparent)
  (orange  #fff  linear-gradient(to bottom, #ff890a 0%,#ff8200 100%)  0 transparent   linear-gradient(to bottom, #e07809 0%,#e07400 100%)  transparent)
  (blue  #fff  linear-gradient(to bottom, #1a90ff 0%,#108cff 100%)  0 transparent   linear-gradient(to bottom, #167fe0 0%,#0d7ae0 100%) transparent )
) !default;

@each $btn-type in $btn-types {
  $type:  nth($btn-type, 1);
  $color: nth($btn-type, 2);
  $color-bg: nth($btn-type, 3);
  $btn-bd-w: nth($btn-type, 4);
  $btn-bd-c: nth($btn-type, 5);
  $color-at: nth($btn-type, 6);
  $btn-bd-at: nth($btn-type, 7); 
  .#{$button}-#{$type} {
    @include btn($color,$color-bg,$btn-bd-w,$btn-bd-c,$color-at,$btn-bd-at);
    &:disabled,
    &.#{$button}-disabled{
      color: rgba($color,.3);
    }
    &:disabled,
    &.#{$button}-disabled{
      &:active{
        background: $color-bg;
        border-color: $btn-bd-c;
      }
    }
  }
}


{% endhighlight%}

