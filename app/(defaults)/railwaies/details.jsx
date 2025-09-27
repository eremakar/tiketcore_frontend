import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function RailwayDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Name" value={resourceData?.name}/>
            <FormField type="label" label="Code" value={resourceData?.code}/>
            <FormField type="label" label="ShortCode" value={resourceData?.shortCode}/>
            <FormField type="label" label="TimeDifferenceFromAdministration" value={resourceData?.timeDifferenceFromAdministration}/>
            <FormField type="label" label="Type" value={resourceData?.type}/>
        </ResourceDetails>
    )
}
