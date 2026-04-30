import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref, nextTick } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'

import VueEasySelect from '../index'
import { makeNamedOptions } from '../../../../tests/helpers/factories'

function makeHost(initial: any, props: Record<string, any> = {}) {
    return defineComponent({
        setup() {
            const value = ref(initial)
            return { value, props }
        },
        render() {
            return h(VueEasySelect, {
                ...this.props,
                modelValue: this.value,
                'onUpdate:modelValue': (v: any) => { this.value = v }
            } as any)
        }
    })
}

const mountSelect = (initial: any, props: Record<string, any>) => {
    const Host = makeHost(initial, props)
    return mount(Host, {
        global: { stubs: { transition: false } }
    })
}

const findControl = (wrapper: any) => wrapper.find('.vue-easy-control')
const isOpen = (wrapper: any) =>
    findControl(wrapper).attributes('aria-expanded') === 'true'

describe('VueEasySelect', () => {
    describe('name (form mirror)', () => {
        it('renders the hidden native <select> when name is set', () => {
            const wrapper = mountSelect('', { name: 'city', options: makeNamedOptions('A') })
            expect(wrapper.find('select').exists()).toBe(true)
            expect(wrapper.find('select').attributes('name')).toBe('city')
        })

        it('does NOT render the native <select> when name is omitted', () => {
            const wrapper = mountSelect('', { options: makeNamedOptions('A') })
            expect(wrapper.find('select').exists()).toBe(false)
        })
    })

    describe('open / close', () => {
        it('starts closed', () => {
            const wrapper = mountSelect('', { name: 'x', options: makeNamedOptions('A', 'B') })
            expect(isOpen(wrapper)).toBe(false)
            expect(document.querySelector('.vue-easy-select__dropdown')).toBeNull()
        })

        it('opens on click and renders the dropdown via Teleport', async () => {
            const wrapper = mountSelect('', { name: 'x', options: makeNamedOptions('A', 'B') })
            await findControl(wrapper).trigger('click')
            await flushPromises()
            expect(isOpen(wrapper)).toBe(true)
            expect(document.querySelector('.vue-easy-select__dropdown')).not.toBeNull()
        })

        it('toggles closed on a second click', async () => {
            const wrapper = mountSelect('', { name: 'x', options: makeNamedOptions('A', 'B') })
            await findControl(wrapper).trigger('click')
            await flushPromises()
            await findControl(wrapper).trigger('click')
            await flushPromises()
            expect(isOpen(wrapper)).toBe(false)
        })

        it('does NOT open when isDisabled', async () => {
            const wrapper = mountSelect('', {
                name: 'x',
                isDisabled: true,
                options: makeNamedOptions('A')
            })
            await findControl(wrapper).trigger('click')
            await flushPromises()
            expect(isOpen(wrapper)).toBe(false)
        })

        it('Escape closes the dropdown', async () => {
            const wrapper = mountSelect('', { name: 'x', options: makeNamedOptions('A') })
            await findControl(wrapper).trigger('click')
            await flushPromises()
            await findControl(wrapper).trigger('keydown', { key: 'Escape' })
            await flushPromises()
            expect(isOpen(wrapper)).toBe(false)
        })
    })

    describe('selection', () => {
        it('single mode auto-closes after selecting an option', async () => {
            const wrapper = mountSelect('', { name: 'x', options: makeNamedOptions('A', 'B') })
            await findControl(wrapper).trigger('click')
            await flushPromises()
            const li = document.querySelectorAll('.vue-easy-options__item')[0] as HTMLElement
            li.click()
            await flushPromises()
            expect((wrapper.vm as any).value).toBe('A')
            expect(isOpen(wrapper)).toBe(false)
        })

        it('multiple mode stays open after selection', async () => {
            const wrapper = mountSelect([], {
                name: 'x',
                isMultiple: true,
                options: makeNamedOptions('A', 'B')
            })
            await findControl(wrapper).trigger('click')
            await flushPromises()
            const li = document.querySelectorAll('.vue-easy-options__item')[0] as HTMLElement
            li.click()
            await flushPromises()
            expect((wrapper.vm as any).value).toEqual(['A'])
            expect(isOpen(wrapper)).toBe(true)
        })

        it('outside click closes the dropdown', async () => {
            const wrapper = mountSelect('', { name: 'x', options: makeNamedOptions('A') })
            await findControl(wrapper).trigger('click')
            await flushPromises()
            await new Promise(r => setTimeout(r, 20))
            await flushPromises()
            const evt = new MouseEvent('click', { bubbles: true })
            Object.defineProperty(evt, 'target', { value: document.body, configurable: true })
            document.dispatchEvent(evt)
            await flushPromises()
            expect(isOpen(wrapper)).toBe(false)
        })
    })

    describe('dropdown positioning', () => {
        function mockRect(rect: Partial<DOMRect>) {
            const full: DOMRect = {
                top: 0, left: 0, width: 200, height: 32,
                bottom: 32, right: 200, x: 0, y: 0,
                toJSON: () => ({}),
                ...rect
            } as DOMRect
            Element.prototype.getBoundingClientRect = vi.fn(() => full) as any
        }

        it('positions DOWN when there is room below', async () => {
            mockRect({ top: 10, left: 5, width: 250, height: 32 })
            Object.defineProperty(document.documentElement, 'offsetHeight', {
                value: 1000, configurable: true
            })
            const wrapper = mountSelect('', { name: 'x', options: makeNamedOptions('A') })
            await findControl(wrapper).trigger('click')
            await flushPromises()
            const dd = document.querySelector('.vue-easy-select__dropdown') as HTMLElement
            expect(dd.classList.contains('vue-easy-select--down')).toBe(true)
            expect(dd.style.transform).toContain('translate3d(5px, 42px')
            expect(dd.style.width).toBe('250px')
        })

        it('positions UP when there is no room below', async () => {
            mockRect({ top: 950, left: 0, width: 200, height: 32 })
            Object.defineProperty(document.documentElement, 'offsetHeight', {
                value: 1000, configurable: true
            })
            const wrapper = mountSelect('', { name: 'x', options: makeNamedOptions('A') })
            await findControl(wrapper).trigger('click')
            await flushPromises()
            const dd = document.querySelector('.vue-easy-select__dropdown') as HTMLElement
            expect(dd.classList.contains('vue-easy-select--up')).toBe(true)
            expect(dd.style.transform).toContain('calc(')
            expect(dd.style.transform).toContain('- 100%')
        })
    })

    describe('lifecycle', () => {
        it('removes listeners on unmount', async () => {
            const wrapper = mountSelect('', { name: 'x', options: makeNamedOptions('A') })
            const removeSpy = vi.spyOn(document, 'removeEventListener')
            const removeWinSpy = vi.spyOn(window, 'removeEventListener')
            wrapper.unmount()
            const removedClick = removeSpy.mock.calls.some(c => c[0] === 'click')
            const removedScroll = removeWinSpy.mock.calls.some(c => c[0] === 'scroll')
            const removedResize = removeWinSpy.mock.calls.some(c => c[0] === 'resize')
            expect(removedClick).toBe(true)
            expect(removedScroll).toBe(true)
            expect(removedResize).toBe(true)
        })
    })
})
