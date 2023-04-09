import type { Component } from 'vue'

import { h } from 'vue'

import { useProvide } from '../../use/use-context';
import {
    componentProps,
    singlePropsValue,
    multiplePropsValue
} from '../../constants/global-props-constants';

const Single = {
    props: {
        ...componentProps,
        modelValue: singlePropsValue
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        useProvide(props, ctx);
        return ctx.slots.default;
    }
};

const Multiple = {
    props: {
        ...componentProps,
        modelValue: multiplePropsValue
    },
    emits: ['update:modelValue'],
    setup(props, ctx) {
        useProvide(props, ctx);
        return ctx.slots.default;
    }
};

function ADWrapper(props, ctx) {
    const isMultiple = props.isMultiple;
    const localComponent = isMultiple ? Multiple : Single;

    return h(localComponent as Component, { ...ctx.attrs, ...props }, ctx.slots)
}

ADWrapper.props = componentProps;
// RenderComponent.emits = ['update:modelValue']

export default ADWrapper;
