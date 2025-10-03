import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function TariffDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Name" value={resourceData?.name}/>
            <FormField type="label" label="IndexCoefficient" value={resourceData?.indexCoefficient}/>
            <FormField type="label" label="VAT" value={resourceData?.vAT}/>
            <FormField type="label" label="BaseFare" value={resourceData?.baseFare?.name}/>
            <FormField type="label" label="TrainCategory" value={resourceData?.trainCategory?.name}/>
            <FormField type="label" label="Wagon" value={resourceData?.wagon?.name}/>
        </ResourceDetails>
    )
}
