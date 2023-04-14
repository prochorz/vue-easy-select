function debounce(func, timeout = 100){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(func.bind(this), timeout, ...args);
    };
}

export { debounce };