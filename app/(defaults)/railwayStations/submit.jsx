import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";

export default function RailwayStationSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        stationId: yup.string().required("Поле обязательное*"),
        railwayId: yup.string().required("Поле обязательное*"),
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

    const stationId = watch('stationId');
    const railwayId = watch('railwayId');
    const stationsResource = useResource('stations');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField resource={stationsResource} type="resourceselect" name="stationId" mode="portal" label="Station" value={stationId} error={errors.stationId?.message} trigger={trigger} onChange={value => setValue('stationId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
