import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";

export default function ConnectionSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        name: yup.string().required("Поле обязательное*"),
        distanceKm: yup.string().required("Поле обязательное*"),
        fromId: yup.string().required("Поле обязательное*"),
        toId: yup.string().required("Поле обязательное*"),
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
    const distanceKm = watch('distanceKm');
    const fromId = watch('fromId');
    const toId = watch('toId');
    const stationsResource = useResource('stations');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="text" name="name" label="Name" value={name} error={errors.name?.message} trigger={trigger} onChange={value => setValue('name', value)} isValidated={true} />
                    <FormField type="number" name="distanceKm" label="DistanceKm" value={distanceKm} error={errors.distanceKm?.message} trigger={trigger} onChange={value => setValue('distanceKm', value)} isValidated={true} />
                    <FormField resource={stationsResource} type="resourceselect" name="fromId" mode="portal" label="From" value={fromId} error={errors.fromId?.message} trigger={trigger} onChange={value => setValue('fromId', value)} isValidated={true} />
                    <FormField resource={stationsResource} type="resourceselect" name="toId" mode="portal" label="To" value={toId} error={errors.toId?.message} trigger={trigger} onChange={value => setValue('toId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
