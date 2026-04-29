import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { debounce } from '../utils-service'

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('does not invoke the callback synchronously', () => {
        const spy = vi.fn()
        const debounced = debounce(spy)
        debounced()
        expect(spy).not.toHaveBeenCalled()
    })

    it('invokes the callback after the default 100 ms', () => {
        const spy = vi.fn()
        const debounced = debounce(spy)
        debounced()
        vi.advanceTimersByTime(99)
        expect(spy).not.toHaveBeenCalled()
        vi.advanceTimersByTime(1)
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it('resets the timer on repeated calls', () => {
        const spy = vi.fn()
        const debounced = debounce(spy, 200)
        debounced()
        vi.advanceTimersByTime(150)
        debounced()
        vi.advanceTimersByTime(150)
        expect(spy).not.toHaveBeenCalled()
        vi.advanceTimersByTime(50)
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it('honors a custom timeout', () => {
        const spy = vi.fn()
        const debounced = debounce(spy, 500)
        debounced()
        vi.advanceTimersByTime(499)
        expect(spy).not.toHaveBeenCalled()
        vi.advanceTimersByTime(1)
        expect(spy).toHaveBeenCalledTimes(1)
    })

    it('forwards arguments to the wrapped function', () => {
        const spy = vi.fn()
        const debounced = debounce(spy)
        debounced('a', 1, { x: true })
        vi.advanceTimersByTime(100)
        expect(spy).toHaveBeenCalledWith('a', 1, { x: true })
    })
})
