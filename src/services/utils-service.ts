function debounce<F extends (...args: any[]) => void>(func: F, timeout = 100) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), timeout);
    };
}

export { debounce };
