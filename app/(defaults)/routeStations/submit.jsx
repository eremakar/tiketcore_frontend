import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import StationLookup from "@/app/(defaults)/stations/lookup";
import useResource from "@/hooks/useResource";

export default function RouteStationSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        order: yup.string().required("Поле обязательное*"),
        arrival: yup.string().required("Поле обязательное*"),
        stop: yup.string().required("Поле обязательное*"),
        departure: yup.string().required("Поле обязательное*"),
        stationId: yup.string().required("Поле обязательное*"),
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

    const order = watch('order');
    const arrival = watch('arrival');
    const stop = watch('stop');
    const departure = watch('departure');
    const stationId = watch('stationId');
    const routeId = watch('routeId');
    const stationsResource = useResource('stations');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="number" name="order" label="Порядок следования" value={order} error={errors.order?.message} trigger={trigger} onChange={value => setValue('order', value)} isValidated={true} />
                    <FormField type="datetime" name="arrival" label="Время прибытия" value={arrival} error={errors.arrival?.message} trigger={trigger} onChange={value => setValue('arrival', value)} isValidated={true} />
                    <FormField type="datetime" name="stop" label="Остановка" value={stop} error={errors.stop?.message} trigger={trigger} onChange={value => setValue('stop', value)} isValidated={true} />
                    <FormField type="datetime" name="departure" label="Время отправления" value={departure} error={errors.departure?.message} trigger={trigger} onChange={value => setValue('departure', value)} isValidated={true} />
                    <FormField name="stationId" label="Station" error={errors.stationId?.message} trigger={trigger} isValidated={true}>
                        <StationLookup resource={stationsResource} placeholder="Выбор Станция" value={stationId} onChange={value => {setValue('stationId', value); trigger(); }} />
                    </FormField>
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
