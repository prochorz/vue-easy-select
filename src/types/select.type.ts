type TModelValue = string | number | boolean;

interface ISelectOption {
    isDisabled?: boolean,
    [key: string]: any
}

export {
    TModelValue,
    ISelectOption
};
