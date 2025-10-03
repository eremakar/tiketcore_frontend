import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function SeatTariffItemDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Distance" value={resourceData?.distance}/>
            <FormField type="label" label="Price" value={resourceData?.price}/>
            <FormField type="label" label="WagonClass" value={resourceData?.wagonClass?.name}/>
            <FormField type="label" label="Season" value={resourceData?.season?.name}/>
            <FormField type="label" label="SeatType" value={resourceData?.seatType?.name}/>
            <FormField type="label" label="From" value={resourceData?.from?.name}/>
            <FormField type="label" label="To" value={resourceData?.to?.name}/>
            <FormField type="label" label="SeatTariff" value={resourceData?.seatTariff?.id}/>
        </ResourceDetails>
    )
}
