import { describe, it, expect } from 'vitest'

import VueEasyControl from '../index'
import { mountWithContext } from '../../../../tests/helpers/mount-with-context'
import { makeNamedOptions } from '../../../../tests/helpers/factories'

describe('VueEasyControl', () => {
    describe('rendering', () => {
        it('renders the placeholder when nothing is selected', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: {
                    placeholder: 'Pick one',
                    options: makeNamedOptions('A')
                }
            })
            expect(wrapper.text()).toContain('Pick one')
        })

        it('renders the selected name in single mode', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: {
                    options: makeNamedOptions('Apple', 'Banana'),
                    modelValue: 'Banana'
                }
            })
            expect(wrapper.text()).toContain('Banana')
        })

        it('renders chips in multiple mode', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: {
                    isMultiple: true,
                    modelValue: ['A', 'B'],
                    options: makeNamedOptions('A', 'B', 'C')
                }
            })
            expect(wrapper.findAll('.vue-easy-state-multiple__item')).toHaveLength(2)
        })

        it('renders the embedded search input when isOpen + isSearchable + searchPosition=control', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { isSearchable: true, searchPosition: 'control' },
                childProps: { isOpen: true }
            })
            expect(wrapper.find('.vue-easy-state-search').exists()).toBe(true)
        })

        it('renders the hidden NativeSelect when name is set', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { name: 'city', options: makeNamedOptions('A') }
            })
            expect(wrapper.find('select').exists()).toBe(true)
        })

        it('does NOT render the NativeSelect when name is empty', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { name: '', options: makeNamedOptions('A') }
            })
            expect(wrapper.find('select').exists()).toBe(false)
        })
    })

    describe('events', () => {
        it('emits toggle on click', async () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A') }
            })
            await wrapper.find('.vue-easy-control').trigger('click')
            expect(wrapper.emitted('toggle')).toHaveLength(1)
        })

        it('does NOT emit toggle when isDisabled', async () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { isDisabled: true, options: makeNamedOptions('A') }
            })
            await wrapper.find('.vue-easy-control').trigger('click')
            expect(wrapper.emitted('toggle')).toBeUndefined()
        })

        it('Escape emits close when open', async () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A') },
                childProps: { isOpen: true }
            })
            await wrapper.find('.vue-easy-control').trigger('keydown', { key: 'Escape' })
            expect(wrapper.emitted('close')).toHaveLength(1)
        })

        it('Space emits toggle', async () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A') }
            })
            await wrapper.find('.vue-easy-control').trigger('keydown', { key: ' ' })
            expect(wrapper.emitted('toggle')).toHaveLength(1)
        })

        it('ArrowDown emits toggle when closed', async () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A', 'B') }
            })
            await wrapper.find('.vue-easy-control').trigger('keydown', { key: 'ArrowDown' })
            expect(wrapper.emitted('toggle')).toHaveLength(1)
        })

        it('ArrowDown moves activeIndex when open', async () => {
            const { wrapper, ctx } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A', 'B', 'C') },
                childProps: { isOpen: true }
            })
            ctx.setActiveIndex(0)
            await wrapper.find('.vue-easy-control').trigger('keydown', { key: 'ArrowDown' })
            expect(ctx.activeIndex.value).toBe(1)
        })

        it('Enter on an active option selects it and emits close in single mode', async () => {
            const { wrapper, parent, ctx } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A', 'B') },
                childProps: { isOpen: true }
            })
            ctx.setActiveIndex(1)
            await wrapper.find('.vue-easy-control').trigger('keydown', { key: 'Enter' })
            expect(parent.emitted('update:modelValue')?.[0]).toEqual(['B'])
            expect(wrapper.emitted('close')).toHaveLength(1)
        })

        it('Enter does NOT emit close in multiple mode', async () => {
            const { wrapper, ctx } = mountWithContext(VueEasyControl, {
                contextProps: {
                    isMultiple: true,
                    modelValue: [],
                    options: makeNamedOptions('A', 'B')
                },
                childProps: { isOpen: true }
            })
            ctx.setActiveIndex(0)
            await wrapper.find('.vue-easy-control').trigger('keydown', { key: 'Enter' })
            expect(wrapper.emitted('close')).toBeUndefined()
        })
    })

    describe('clear button', () => {
        it('is visible when isClearable + has value + not disabled', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: {
                    isClearable: true,
                    options: makeNamedOptions('A'),
                    modelValue: 'A'
                }
            })
            expect(wrapper.find('.vue-easy-control__clear').exists()).toBe(true)
        })

        it('is hidden when no value', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: {
                    isClearable: true,
                    options: makeNamedOptions('A')
                }
            })
            expect(wrapper.find('.vue-easy-control__clear').exists()).toBe(false)
        })

        it('is hidden when isDisabled', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: {
                    isClearable: true,
                    isDisabled: true,
                    options: makeNamedOptions('A'),
                    modelValue: 'A'
                }
            })
            expect(wrapper.find('.vue-easy-control__clear').exists()).toBe(false)
        })

        it('clicking clear emits empty string in single mode', async () => {
            const { wrapper, parent } = mountWithContext(VueEasyControl, {
                contextProps: {
                    isClearable: true,
                    options: makeNamedOptions('A'),
                    modelValue: 'A'
                }
            })
            await wrapper.find('.vue-easy-control__clear').trigger('click')
            expect(parent.emitted('update:modelValue')?.[0]).toEqual([''])
        })
    })

    describe('a11y', () => {
        it('has role=combobox + aria-haspopup=listbox + aria-controls=listId', () => {
            const { wrapper, ctx } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A') }
            })
            const root = wrapper.find('.vue-easy-control')
            expect(root.attributes('role')).toBe('combobox')
            expect(root.attributes('aria-haspopup')).toBe('listbox')
            expect(root.attributes('aria-controls')).toBe(ctx.listId)
        })

        it('aria-expanded reflects isOpen', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A') },
                childProps: { isOpen: true }
            })
            expect(wrapper.find('.vue-easy-control').attributes('aria-expanded')).toBe('true')
        })

        it('aria-activedescendant points at the active option id', () => {
            const { wrapper, ctx } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A', 'B') },
                childProps: { isOpen: true }
            })
            ctx.setActiveIndex(1)
            return wrapper.vm.$nextTick().then(() => {
                expect(wrapper.find('.vue-easy-control').attributes('aria-activedescendant'))
                    .toBe(ctx.getOptionId(1))
            })
        })

        it('aria-disabled is set when isDisabled', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { isDisabled: true, options: makeNamedOptions('A') }
            })
            expect(wrapper.find('.vue-easy-control').attributes('aria-disabled')).toBe('true')
        })
    })

    describe('slots', () => {
        it('uses the #arrow slot when provided', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A') },
                slots: { arrow: () => 'ARROW' }
            })
            expect(wrapper.find('.vue-easy-control__arrow').text()).toBe('ARROW')
        })

        it('uses the #state slot when value is set', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: { options: makeNamedOptions('A'), modelValue: 'A' },
                slots: { state: ({ state }: any) => `STATE:${state.name}` }
            })
            expect(wrapper.text()).toContain('STATE:A')
        })

        it('uses the #clear-icon slot inside the clear button', () => {
            const { wrapper } = mountWithContext(VueEasyControl, {
                contextProps: {
                    isClearable: true,
                    options: makeNamedOptions('A'),
                    modelValue: 'A'
                },
                slots: { 'clear-icon': () => 'X' }
            })
            expect(wrapper.find('.vue-easy-control__clear').text()).toBe('X')
        })
    })
})
