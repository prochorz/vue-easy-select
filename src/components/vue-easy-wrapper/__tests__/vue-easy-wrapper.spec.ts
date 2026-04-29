import { describe, it, expect } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

import VueEasyWrapper from '../index'
import { useInject } from '../../../use/use-context'

const Probe = defineComponent({
    name: 'Probe',
    setup() {
        const ctx = useInject()
        return () =>
            h('div', { class: 'probe' }, [
                h('span', { class: 'probe-mode' }, ctx.globalProps.isMultiple ? 'multi' : 'single'),
                h('span', { class: 'probe-key' }, ctx.globalProps.keyField),
                h('span', { class: 'probe-name' }, ctx.globalProps.nameField),
                h(
                    'button',
                    {
                        class: 'probe-toggle',
                        onClick: () => {
                            ctx.localValue.value = ctx.globalProps.isMultiple
                                ? [...(ctx.localValue.value as any[]), 'X']
                                : 'X'
                        }
                    },
                    'toggle'
                )
            ])
    }
})

describe('VueEasyWrapper', () => {
    it('dispatches to Single mode by default and forwards modelValue', () => {
        const wrapper = mount(VueEasyWrapper, {
            props: { name: 'x', modelValue: 'A' },
            slots: { default: () => h(Probe) }
        })
        expect(wrapper.find('.probe-mode').text()).toBe('single')
    })

    it('dispatches to Multiple mode when isMultiple is true', () => {
        const wrapper = mount(VueEasyWrapper, {
            props: { name: 'x', isMultiple: true, modelValue: [] },
            slots: { default: () => h(Probe) }
        })
        expect(wrapper.find('.probe-mode').text()).toBe('multi')
    })

    it('forwards keyField and nameField through provide', () => {
        const wrapper = mount(VueEasyWrapper, {
            props: {
                name: 'x',
                keyField: 'value',
                nameField: 'label'
            },
            slots: { default: () => h(Probe) }
        })
        expect(wrapper.find('.probe-key').text()).toBe('value')
        expect(wrapper.find('.probe-name').text()).toBe('label')
    })

    it('forwards update:modelValue to a v-model parent (single mode)', async () => {
        const calls: any[] = []
        const wrapper = mount(VueEasyWrapper, {
            props: {
                name: 'x',
                modelValue: '',
                'onUpdate:modelValue': (v: any) => calls.push(v)
            } as any,
            slots: { default: () => h(Probe) }
        })
        await wrapper.find('.probe-toggle').trigger('click')
        expect(calls).toEqual(['X'])
    })

    it('forwards update:modelValue as an array in multiple mode', async () => {
        const calls: any[] = []
        const wrapper = mount(VueEasyWrapper, {
            props: {
                name: 'x',
                isMultiple: true,
                modelValue: ['A'],
                'onUpdate:modelValue': (v: any) => calls.push(v)
            } as any,
            slots: { default: () => h(Probe) }
        })
        await wrapper.find('.probe-toggle').trigger('click')
        expect(calls).toEqual([['A', 'X']])
    })
})
