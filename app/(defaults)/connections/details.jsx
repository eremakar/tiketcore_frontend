import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function ConnectionDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Name" value={resourceData?.name}/>
            <FormField type="label" label="DistanceKm" value={resourceData?.distanceKm}/>
            <FormField type="label" label="From" value={resourceData?.from?.name}/>
            <FormField type="label" label="To" value={resourceData?.to?.name}/>
        </ResourceDetails>
    )
}
