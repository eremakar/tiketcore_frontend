import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function TrainWagonsPlanWagonDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Number" value={resourceData?.number}/>
            <FormField type="label" label="Plan" value={resourceData?.plan?.id}/>
            <FormField type="label" label="Wagon" value={resourceData?.wagon?.name}/>
        </ResourceDetails>
    )
}
