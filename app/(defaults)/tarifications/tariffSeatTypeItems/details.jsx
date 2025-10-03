import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function TariffSeatTypeItemDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="IndexCoefficient" value={resourceData?.indexCoefficient}/>
            <FormField type="label" label="SeatType" value={resourceData?.seatType?.name}/>
            <FormField type="label" label="TariffWagon" value={resourceData?.tariffWagon?.id}/>
        </ResourceDetails>
    )
}
