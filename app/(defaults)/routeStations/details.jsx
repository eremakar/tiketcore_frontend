import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { formatDurationFromEpoch } from "@/components/genA/functions/datetime";

export default function RouteStationDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Ид" value={resourceData?.id}/>
            <FormField type="label" label="Маршрут" value={resourceData?.route?.name}/>
            <FormField type="label" label="Порядок следования" value={resourceData?.order}/>
            <FormField type="label" label="Станция" value={resourceData?.station?.name}/>
            <FormField type="label" label="Время прибытия" value={formatDurationFromEpoch(resourceData?.arrival)}/>
            <FormField type="label" label="Остановка" value={formatDurationFromEpoch(resourceData?.stop)}/>
            <FormField type="label" label="Время отправления" value={formatDurationFromEpoch(resourceData?.departure)}/>
        </ResourceDetails>
    )
}
