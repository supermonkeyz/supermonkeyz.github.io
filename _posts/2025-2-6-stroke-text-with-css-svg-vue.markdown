---
layout: post
title:  "使用CSS和SVG在Vue组件中实现文字描边效果"
date:   2025-2-6 23:08:00 +0800
categories: CSS SVG Vue.js
comments: true
---

文字描边效果在视觉设计中确实非常重要，尤其是在需要突出文字信息的场景下。然而，将 Figma 设计稿中的文字描边效果完美地复现到实际开发中，确实存在一些挑战。以下是使用 CSS 和 SVG 两种方案来实现文字描边效果的详细方法，帮助你缩小设计稿与实际效果之间的差距。

为了易用封装为一下Vue组件，只需要简单传参即可不断复用。

<!--more-->
### 方案一：CSS Text Stroke
CSS Text Stroke 是一种通过 CSS 属性来实现文字描边效果的方法。它利用了 CSS 的 `-webkit-text-stroke` 属性。

``` html
<script lang="ts">
export default {
    name: 'JopStrokeText'
}
</script>
<script lang="ts" setup>
interface Props {
    text: string | number;
}
defineProps<Props>();
</script>

<template>
    <span class="stroke-text" :data-content="text">{{ text }}</span>
</template>

<style>
:root {
    --j-stroke-text-font-family: unset;
    --j-stroke-text-font-size: 17px;
    --j-stroke-text-font-weight: 400;
    --j-stroke-text-line-height: normal;
    --j-stroke-text-stroke-width: 3px;
    --j-stroke-text-stroke-color: #222;
    --j-stroke-text-stroke-color: #fff;
    --j-stroke-text-skew: #000;
    --j-stroke-text-letter-spacing: 0;
}
</style>

<style lang="scss" scoped>
.stroke-text {
    font-family: var(--j-stroke-text-font-family), sans-serif;
    display: inline-flex;
    font-size: var(--j-stroke-text-font-size);
    line-height: var(--j-stroke-text-line-height);
    transform: var(--j-stroke-text-skew);
    letter-spacing: var(--j-stroke-text-letter-spacing);
    font-weight: var(--j-stroke-text-font-weight);
    margin-top: auto;
    position: relative;
    white-space: pre-wrap;

    &::before {
        content: attr(data-content);
        position: absolute;
        left: 0;
        top: 0;
        -webkit-text-stroke: var(--j-stroke-text-stroke-width) var(--j-stroke-text-stroke-color);
        color: var(--j-stroke-text-stroke-color);
        /* 填充空隙 */
        text-shadow:
            0.5px 0 currentColor,
            0 0.5px currentColor,
            -0.5px 0 currentColor,
            0 -0.5px currentColor;
    }

    &::after {
        content: attr(data-content);
        position: absolute;
        left: 0;
        top: 0;
        background: var(--j-stroke-text-color);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}
</style>
```
### 方案二：SVG Text Stroke

``` html
<script lang="ts">
export default {
    name: 'JopStrokeTextSvg'
}
</script>
<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue-demi';
import { px2rem } from '@pet/core.mobile';

export interface Stops {
    color: string;
    offset: string;
}

interface Props {
    value?: string | number;
    fillColors?: Stops[];
    strokeColors?: Stops[];
    gradientRotate?: number;
    strokeWidth?: number;
    shadowColor?: string;
    shadowOffset?: number;
    viewboxSize?: number;
    fontSize?: number;
}
const props = withDefaults(defineProps<Props>(), {
    value: '1',
    fillColors: () => [
        {
            color: '#ff8200',
            offset: '0',
        },
        {
            color: '#e52e2e',
            offset: '1',
        },
    ],
    strokeColors: () => [
        {
            color: '#fff',
            offset: '0',
        },
        {
            color: '#fff',
            offset: '1',
        },
    ],
    gradientRotate: 345,
    strokeWidth: 4,
    viewboxSize: 30,
    fontSize: 12,
});

const uid = getCurrentInstance()?.uid ?? Math.round(Math.random() * 100000);
const fillId = computed(() => `stroke-text-fill-${uid}`);
const strokeId = computed(() => `stroke-text-stroke-${uid}`);
const gradientRotateValue = computed(() => `rotate(${props.gradientRotate})`);
const shadowColorStyle = computed(() => {
    const filter =
        props.shadowColor !== undefined
            ? {
                  filter: 'drop-shadow(0px 0px var(--stroke-shadow-offset-1, 0.03125em) var(--stroke-shadow-color, #ffe4c4)) drop-shadow(0px 0px var(--stroke-shadow-offset-2, 0.05em) var(--stroke-shadow-color, #ffe4c4))',
              }
            : {};
    const color =
        props.shadowColor !== undefined
            ? {
                  '--stroke-shadow-color': props.shadowColor,
              }
            : {};
    const offset =
        props.shadowOffset !== undefined
            ? {
                  '--stroke-shadow-offset-1': `${props.shadowOffset * 0.03125}em`,
                  '--stroke-shadow-offset-2': `${props.shadowOffset * 0.05}em`,
              }
            : {};
    return {
        ...filter,
        ...color,
        ...offset,
    };
});

const singleViewSize = computed(() => props.fontSize + props.strokeWidth * 2);

const viewboxValue = computed(() => {
    return props.value.toString().length * singleViewSize.value;
});

const setStyle = computed(() => {
    return {
        width: `${props.value.toString().length}em`,
        'font-size': px2rem(singleViewSize.value),
    };
});
</script>

<template>
    <svg
        class="stroke-font"
        :viewBox="`0 0 ${viewboxValue} ${singleViewSize}`"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        :style="setStyle"
    >
        <defs>
            <linearGradient
                :id="fillId"
                x1="0"
                x2="0"
                y1="0%"
                y2="100%"
                :gradientTransform="gradientRotateValue"
                gradientUnits="userSpaceOnUse"
            >
                <stop v-for="stop in fillColors" :key="stop.color" :stop-color="stop.color" :offset="stop.offset" />
            </linearGradient>
            <linearGradient
                :id="strokeId"
                x1="0"
                x2="0"
                y1="0%"
                y2="100%"
                :gradientTransform="gradientRotateValue"
                gradientUnits="userSpaceOnUse"
            >
                <stop
                    v-for="(stop, index) in strokeColors"
                    :key="index"
                    :stop-color="stop.color"
                    :offset="stop.offset"
                />
            </linearGradient>
        </defs>

        <text
            x="50%"
            y="50%"
            class="stroke-text"
            paint-order="stroke"
            :fill="`url(#${fillId})`"
            :stroke="`url(#${strokeId})`"
            :stroke-width="strokeWidth"
            :style="shadowColorStyle"
            :font-size="fontSize"
        >
            {{ value }}
        </text>
    </svg>
</template>

<style lang="scss" scoped>
.stroke-font {
    vertical-align: top;
}

.stroke-text {
    text-anchor: middle;
    alignment-baseline: central;
    stroke-linejoin: round;
    stroke-linecap: round;
    paint-order: stroke;
}
</style>
```