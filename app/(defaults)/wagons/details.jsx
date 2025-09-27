import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function WagonDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Type" value={resourceData?.type}/>
            <FormField type="label" label="SeatCount" value={resourceData?.seatCount}/>
            <FormField type="label" label="PictureS3" value={resourceData?.pictureS3 ? JSON.stringify(resourceData?.pictureS3) : null}/>
            <FormField type="label" label="Class" value={resourceData?.class}/>
        </ResourceDetails>
    )
}
