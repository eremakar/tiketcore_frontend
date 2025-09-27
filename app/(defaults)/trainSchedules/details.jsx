import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { formatDateTime } from "@/components/genA/functions/datetime";

export default function TrainScheduleDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Date" value={formatDateTime(resourceData?.date)}/>
            <FormField type="label" label="Active" value={resourceData?.active ? "Да" : "Нет"}/>
            <FormField type="label" label="Train" value={resourceData?.train?.name}/>
        </ResourceDetails>
    )
}
