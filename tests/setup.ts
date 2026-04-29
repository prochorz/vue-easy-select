import { vi, beforeEach, afterEach } from 'vitest'
import { enableAutoUnmount } from '@vue/test-utils'

enableAutoUnmount(afterEach)

afterEach(() => {
    document.body.innerHTML = ''
})

Element.prototype.scrollIntoView = vi.fn()

class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
;(globalThis as any).ResizeObserver = (globalThis as any).ResizeObserver || ResizeObserverStub

const defaultRect = () => ({
    top: 0,
    left: 0,
    width: 200,
    height: 32,
    bottom: 32,
    right: 200,
    x: 0,
    y: 0,
    toJSON: () => ({})
})

beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(defaultRect) as unknown as () => DOMRect
})
