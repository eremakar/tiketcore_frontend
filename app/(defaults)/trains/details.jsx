import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function TrainDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Name" value={resourceData?.name}/>
            <FormField type="label" label="Тип поезда, например Тальго" value={resourceData?.type}/>
            <FormField type="label" label="Зональность: пригородный, общий и т.п." value={resourceData?.zoneType}/>
            <FormField type="label" label="From" value={resourceData?.from?.name}/>
            <FormField type="label" label="To" value={resourceData?.to?.name}/>
            <FormField type="label" label="Route" value={resourceData?.route?.name}/>
        </ResourceDetails>
    )
}
