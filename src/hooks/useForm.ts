import { use, useState } from 'react';

type Errors<T> = { [K in keyof T]?: string };

const useForm = <T extends Record<string, any>>(initialValues: T) => {
    const [formData, setFormData] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Errors<T>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        callBack?: () => void) => {

        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
        if (callBack) {
            callBack();
        }
    };

    const handleBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
        validate?: (field: string, value: string, formData: T) => string
    ) => {
        const { name, value } = e.target;
        if (validate) {
            const message = validate(name, value, formData);
            setErrors(prev => ({ ...prev, [name]: message }));
        }
    };

    const setFormErrors = (newErrors: Errors<T>) => {
        setErrors(newErrors);
    };

    return { formData, errors, handleChange, handleBlur, setFormErrors, setFormData };
};

export default useForm;