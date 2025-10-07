import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function TrainDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Name" value={resourceData?.name}/>
            <FormField type="label" label="Тип поезда" value={resourceData?.type?.name}/>
            <FormField type="label" label="Зональность" value={{ 1: 'Пригородный', 2: 'Общий' }[resourceData?.zoneType] || resourceData?.zoneType}/>
            <FormField type="label" label="From" value={resourceData?.from?.name}/>
            <FormField type="label" label="To" value={resourceData?.to?.name}/>
            <FormField type="label" label="Route" value={resourceData?.route?.name}/>
            <FormField type="label" label="Periodicity" value={resourceData?.periodicity?.name}/>
        </ResourceDetails>
    )
}
