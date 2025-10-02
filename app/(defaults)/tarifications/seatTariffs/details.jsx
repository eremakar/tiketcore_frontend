import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function SeatTariffDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Name" value={resourceData?.name}/>
            <FormField type="label" label="Train" value={resourceData?.train?.name}/>
            <FormField type="label" label="BaseFare" value={resourceData?.baseFare?.name}/>
            <FormField type="label" label="TrainCategory" value={resourceData?.trainCategory?.name}/>
        </ResourceDetails>
    )
}
