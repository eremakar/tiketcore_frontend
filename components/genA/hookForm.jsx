import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormErrors from '@/components/genA/formErrors';

export default function HookForm({ data, onSubmit, methods, children, style, isValidated = true, ...props }) {
    const {
        trigger,
        formState: {isValid, errors},
        reset
    } = methods;

    useEffect(() => {
        if (!data)
            return;
        reset(data);
        if (isValidated)
            trigger();
    }, [data]);

    const formErrors = [];

    if (!isValid) {
        for (const key in errors) {
            const item = errors[key];
            formErrors.push({
                name: key,
                message: item.message
            })
        }
    }

    return <FormProvider {...methods} >
        <form style={{style}} onSubmit={onSubmit} {...props}>
            <FormErrors isValid={isValid} errors={formErrors} />
            {children}
        </form>
    </FormProvider>
}
