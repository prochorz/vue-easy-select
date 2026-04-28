import type { Component } from 'vue'

import { h, defineComponent } from 'vue'

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
        return () => ctx.slots.default?.();
    }
});

const Multiple = defineComponent({
    props: {
        ...componentProps,
        ...multipleProps
    },
    setup(props, ctx) {
        useProvide(props, ctx);
        return () => ctx.slots.default?.();
    }
});

const VueEasyWrapper = defineComponent({
    name: 'VueEasyWrapper',
    props: {
        ...stubProps,
        ...componentProps
    },
    setup(props, ctx) {
        return () => {
            const Target = props.isMultiple ? Multiple : Single;
            const allowedKeys = Object.keys(Target.props as Record<string, unknown>);
            const forwarded = allowedKeys.reduce((acc, key) => {
                acc[key] = (props as Record<string, any>)[key];
                return acc;
            }, {} as Record<string, any>);
            return h(Target as Component, { ...ctx.attrs, ...forwarded }, ctx.slots);
        };
    }
});

export default VueEasyWrapper;
