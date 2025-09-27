import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";

export default function StationDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <FormField type="label" label="Name" value={resourceData?.name}/>
            <FormField type="label" label="Code" value={resourceData?.code}/>
            <FormField type="label" label="ShortName" value={resourceData?.shortName}/>
            <FormField type="label" label="ShortNameLatin" value={resourceData?.shortNameLatin}/>
            <FormField type="label" label="Depots" value={resourceData?.depots ? JSON.stringify(resourceData?.depots) : null}/>
            <FormField type="label" label="IsCity" value={resourceData?.isCity ? "Да" : "Нет"}/>
            <FormField type="label" label="CityCode" value={resourceData?.cityCode}/>
            <FormField type="label" label="IsSalePoint" value={resourceData?.isSalePoint ? "Да" : "Нет"}/>
        </ResourceDetails>
    )
}
