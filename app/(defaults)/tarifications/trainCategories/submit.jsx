import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";

export default function TrainCategorySubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        name: yup.string().required("Поле обязательное*"),
        code: yup.string().required("Поле обязательное*"),
        tarifCoefficient: yup.string().required("Поле обязательное*"),
    }));
    const methods = useForm({
        resolver: resolver,
    });
    const {
        watch,
        setValue,
        trigger,
        formState: {errors},
        handleSubmit
    } = methods;

    const name = watch('name');
    const code = watch('code');
    const tarifCoefficient = watch('tarifCoefficient');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="text" name="name" label="Name" value={name} error={errors.name?.message} trigger={trigger} onChange={value => setValue('name', value)} isValidated={true} />
                    <FormField type="text" name="code" label="Code" value={code} error={errors.code?.message} trigger={trigger} onChange={value => setValue('code', value)} isValidated={true} />
                    <FormField type="number" name="tarifCoefficient" label="Тарифный коэффициент" value={tarifCoefficient} error={errors.tarifCoefficient?.message} trigger={trigger} onChange={value => setValue('tarifCoefficient', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
