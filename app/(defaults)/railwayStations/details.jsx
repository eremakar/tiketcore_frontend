import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function RailwayStationDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Station" value={resourceData?.station?.name}/>
            <FormField type="label" label="Railway" value={resourceData?.railway?.id}/>
        </ResourceDetails>
    )
}
