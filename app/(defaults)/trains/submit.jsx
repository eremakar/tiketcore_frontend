import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";

export default function TrainSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        name: yup.string().required("Поле обязательное*"),
        type: yup.string().required("Поле обязательное*"),
        zoneType: yup.string().required("Поле обязательное*"),
        fromId: yup.string().required("Поле обязательное*"),
        toId: yup.string().required("Поле обязательное*"),
        routeId: yup.string().required("Поле обязательное*"),
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
    const type = watch('type');
    const zoneType = watch('zoneType');
    const fromId = watch('fromId');
    const toId = watch('toId');
    const routeId = watch('routeId');
    const stationsResource = useResource('stations');
    const routesResource = useResource('routes');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="text" name="name" label="Name" value={name} error={errors.name?.message} trigger={trigger} onChange={value => setValue('name', value)} isValidated={true} />
                    <FormField type="number" name="type" label="Тип поезда, например Тальго" value={type} error={errors.type?.message} trigger={trigger} onChange={value => setValue('type', value)} isValidated={true} />
                    <FormField type="number" name="zoneType" label="Зональность: пригородный, общий и т.п." value={zoneType} error={errors.zoneType?.message} trigger={trigger} onChange={value => setValue('zoneType', value)} isValidated={true} />
                    <FormField resource={stationsResource} type="resourceselect" name="fromId" mode="portal" label="From" value={fromId} error={errors.fromId?.message} trigger={trigger} onChange={value => setValue('fromId', value)} isValidated={true} />
                    <FormField resource={stationsResource} type="resourceselect" name="toId" mode="portal" label="To" value={toId} error={errors.toId?.message} trigger={trigger} onChange={value => setValue('toId', value)} isValidated={true} />
                    <FormField resource={routesResource} type="resourceselect" name="routeId" mode="portal" label="Route" value={routeId} error={errors.routeId?.message} trigger={trigger} onChange={value => setValue('routeId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
