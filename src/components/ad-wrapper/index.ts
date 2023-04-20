import type { Component } from 'vue'

import { h, defineComponent} from 'vue'

import { useProvide } from '../../use/use-context';
import {
    stubProps,
    singleProps,
    multipleProps,
    componentProps
} from '../../constants/global-props-constants';

const Single = defineComponent({
    props: {
        ...componentProps,
        ...singleProps
    },
    setup(props, ctx) {
        useProvide(props, ctx);
        return ctx.slots.default;
    }
});

const Multiple = defineComponent({
    props: {
        ...componentProps,
        ...multipleProps
    },
    setup(props, ctx) {
        useProvide(props, ctx);
        return ctx.slots.default;
    }
});

function ADWrapper(props, ctx) {
    const isMultiple = props.isMultiple;
    const localComponent = isMultiple ? Multiple : Single;
    const localProps = Object.keys(localComponent.props).reduce((acc, key) => {
        acc[key] = props[key];
        return acc;
    }, {} as any);

    return h(localComponent as Component, { ...ctx.attrs, ...localProps }, ctx.slots)
}

ADWrapper.props = {
    ...stubProps,
    ...componentProps
};

export default ADWrapper;
