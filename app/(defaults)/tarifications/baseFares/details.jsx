import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function BaseFareDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Name" value={resourceData?.name}/>
            <FormField type="label" label="Price" value={resourceData?.price}/>
        </ResourceDetails>
    )
}
