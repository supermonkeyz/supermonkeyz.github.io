---
layout: post
title:  "Javascript Debounce & Throttle Function | JS防抖截流函数"
date:   2020-10-28 19:00:41 +0800
categories: snippet
comments: true
---

## Javascript Debounce & Throttle Function

<!--more-->

### Debounce

```javascript
function debounce(fn, wait, immediate) {
  let timer = null;
  return function() {
    const context = this;
    const args = arguments;
    if (!timer && immediate) fn.apply(context, args);
    if (timer) clearTimeout(timer);
    const later = function() {
      timer = null;
      if (!immediate) fn.apply(context, args);
    }
    timer = setTimeout(later, wait);
  };
}
```

### 测试代码

```html
<button id="debounce">debounce</button>
```

```javascript
function testDebounce() {
  console.log('Debounce Works');
}

document.getElementById('debounce').addEventListener('click', debounce(testDebounce, 1000, true));
```

### Throttle

``` javascript
function throttle(fn, wait, immediate) {
  let timer = null;
  return function() {
    var context = this;
    var args = arguments;
    if (timer) return;
    if (immediate) fn.apply(context, args);
    const later = function() {
      timer = null;
      if(!immediate) fn.apply(context, args);
    }
    timer = setTimeout(later, wait);
  };
}
```

### 测试代码

```javascript
function testThrottle() {
  console.log('Throttle Works');
}

document.documentElement.addEventListener('resize', throttle(testThrottle, 1000, false));
```
