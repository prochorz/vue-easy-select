import type { Ref } from 'vue';

import {
    ref,
    watch,
    onUnmounted
} from 'vue';

import { debounce } from '../services/utils-service';

const DEBOUNCE_DELAY = 150;

function useResizeObserver(el: Ref<HTMLElement>) {
    const resizeObserver = ref();
    const width = ref(0);
    const height = ref(0);

    const updateResizeHandler = debounce(() => {
        width.value = el.value?.clientWidth;
        height.value = el.value?.clientHeight;
    }, DEBOUNCE_DELAY);

    function init() {
        resizeObserver.value = new ResizeObserver(updateResizeHandler);
        resizeObserver.value.observe(el.value);
    }

    function destroy() {
        resizeObserver.value?.disconnect();
    }

    watch(el, () => {
        if (el.value) {
            init();
        } else {
            destroy();
        }
    }, { immediate: true });

    onUnmounted(destroy);

    return {
        width,
        height
    };
}

export default useResizeObserver;
