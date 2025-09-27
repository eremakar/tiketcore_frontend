import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";

export default function TrainWagonsPlanWagonSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        number: yup.string().required("Поле обязательное*"),
        planId: yup.string().required("Поле обязательное*"),
        wagonId: yup.string().required("Поле обязательное*"),
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

    const number = watch('number');
    const planId = watch('planId');
    const wagonId = watch('wagonId');
    const wagonsResource = useResource('wagons');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="text" name="number" label="Number" value={number} error={errors.number?.message} trigger={trigger} onChange={value => setValue('number', value)} isValidated={true} />
                    <FormField resource={wagonsResource} type="resourceselect" name="wagonId" mode="portal" label="Wagon" value={wagonId} error={errors.wagonId?.message} trigger={trigger} onChange={value => setValue('wagonId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
