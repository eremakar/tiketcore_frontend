import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { formatDateTime } from "@/components/genA/functions/datetime";

export default function SeatReservationDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Number" value={resourceData?.number}/>
            <FormField type="label" label="Date" value={formatDateTime(resourceData?.date)}/>
            <FormField type="label" label="Price" value={resourceData?.price}/>
            <FormField type="label" label="Total" value={resourceData?.total}/>
            <FormField type="label" label="From" value={resourceData?.from?.name}/>
            <FormField type="label" label="To" value={resourceData?.to?.name}/>
            <FormField type="label" label="Train" value={resourceData?.train?.name}/>
            <FormField type="label" label="Wagon" value={resourceData?.wagon?.name}/>
            <FormField type="label" label="Seat" value={resourceData?.seat?.name}/>
            <FormField type="label" label="TrainSchedule" value={resourceData?.trainSchedule?.name}/>
        </ResourceDetails>
    )
}
