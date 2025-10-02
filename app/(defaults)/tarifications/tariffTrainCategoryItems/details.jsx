import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function TariffTrainCategoryItemDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="IndexCoefficient" value={resourceData?.indexCoefficient}/>
            <FormField type="label" label="TrainCategory" value={resourceData?.trainCategory?.name}/>
            <FormField type="label" label="Tariff" value={resourceData?.tariff?.id}/>
        </ResourceDetails>
    )
}
