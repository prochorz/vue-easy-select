import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'

import VueEasyOptions from '../index'
import { mountWithContext } from '../../../../tests/helpers/mount-with-context'
import { makeNamedOptions, makeMixedOptions } from '../../../../tests/helpers/factories'

describe('VueEasyOptions', () => {
    it('renders one <li> per option', () => {
        const { wrapper } = mountWithContext(VueEasyOptions, {
            contextProps: { options: makeNamedOptions('A', 'B', 'C') }
        })
        expect(wrapper.findAll('li.vue-easy-options__item')).toHaveLength(3)
    })

    it('renders the empty fallback when there are no options', () => {
        const { wrapper } = mountWithContext(VueEasyOptions, {
            contextProps: { options: [] }
        })
        const empty = wrapper.find('.vue-easy-options__empty')
        expect(empty.exists()).toBe(true)
        expect(empty.text()).toContain('No options')
    })

    it('uses the #empty slot when provided', () => {
        const { wrapper } = mountWithContext(VueEasyOptions, {
            contextProps: { options: [] },
            slots: { empty: () => 'NOTHING' }
        })
        expect(wrapper.find('.vue-easy-options__empty').text()).toContain('NOTHING')
    })

    it('emits selected and updates modelValue on click of an enabled option', async () => {
        const { wrapper, parent } = mountWithContext(VueEasyOptions, {
            contextProps: { options: makeNamedOptions('A', 'B') }
        })
        await wrapper.findAll('li')[1].trigger('click')
        expect(wrapper.emitted('selected')?.[0]?.[0]).toMatchObject({ id: 'B' })
        expect(parent.emitted('update:modelValue')?.[0]).toEqual(['B'])
    })

    it('does NOT emit selected when clicking a disabled option', async () => {
        const { wrapper, parent } = mountWithContext(VueEasyOptions, {
            contextProps: { options: makeMixedOptions() }
        })
        await wrapper.findAll('li')[1].trigger('click')
        expect(wrapper.emitted('selected')).toBeUndefined()
        expect(parent.emitted('update:modelValue')).toBeUndefined()
    })

    it('aria-selected reflects checked state, aria-disabled reflects disabled state', () => {
        const { wrapper } = mountWithContext(VueEasyOptions, {
            contextProps: {
                options: makeMixedOptions(),
                modelValue: 'a'
            }
        })
        const items = wrapper.findAll('li')
        expect(items[0].attributes('aria-selected')).toBe('true')
        expect(items[1].attributes('aria-selected')).toBe('false')
        expect(items[1].attributes('aria-disabled')).toBe('true')
        expect(items[0].attributes('aria-disabled')).toBeUndefined()
    })

    it('root has role=listbox and aria-multiselectable in multiple mode', () => {
        const { wrapper } = mountWithContext(VueEasyOptions, {
            contextProps: {
                isMultiple: true,
                modelValue: [],
                options: makeNamedOptions('A')
            }
        })
        const root = wrapper.find('[role=listbox]')
        expect(root.exists()).toBe(true)
        expect(root.attributes('aria-multiselectable')).toBe('true')
    })

    it('mouseenter sets the active class via setActiveIndex', async () => {
        const { wrapper } = mountWithContext(VueEasyOptions, {
            contextProps: { options: makeNamedOptions('A', 'B', 'C') }
        })
        const li = wrapper.findAll('li')[2]
        await li.trigger('mouseenter')
        expect(li.find('.vue-easy-options__item-inner--active').exists()).toBe(true)
    })

    it('renders the embedded search when searchPosition is options + isSearchable', () => {
        const { wrapper } = mountWithContext(VueEasyOptions, {
            contextProps: {
                isSearchable: true,
                searchPosition: 'options',
                options: makeNamedOptions('A')
            }
        })
        expect(wrapper.find('.vue-easy-options__search').exists()).toBe(true)
    })

    it('mounts with activeIndex set to the first selected enabled option', async () => {
        const { ctx } = mountWithContext(VueEasyOptions, {
            contextProps: {
                options: makeNamedOptions('A', 'B', 'C'),
                modelValue: 'B'
            }
        })
        await nextTick()
        expect(ctx.activeIndex.value).toBe(1)
    })

    it('mounts with activeIndex set to the first enabled option when nothing is selected', async () => {
        const { ctx } = mountWithContext(VueEasyOptions, {
            contextProps: { options: makeMixedOptions() }
        })
        await nextTick()
        expect(ctx.activeIndex.value).toBe(0)
    })

    it('exposes scoped slot props (item, isActive) to #item', async () => {
        const { wrapper } = mountWithContext(VueEasyOptions, {
            contextProps: {
                options: makeNamedOptions('A', 'B'),
                modelValue: 'A'
            },
            slots: {
                item: ({ item, isActive }: any) =>
                    `${item.name}|active=${isActive}`
            }
        })
        await nextTick()
        const text = wrapper.findAll('li').map(li => li.text()).join(' / ')
        expect(text).toContain('A|active=true')
        expect(text).toContain('B|active=false')
    })
})
