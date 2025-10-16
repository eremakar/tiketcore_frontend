import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { formatDateTime } from "@/components/genA/functions/datetime";

export default function SeatReservationDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <Fields cols={2} title="Информация о бронировании">
                <FormField type="label" label="Номер брони" value={resourceData?.number}/>
                <FormField type="label" label="Дата" value={formatDateTime(resourceData?.date)}/>
                <FormField type="label" label="Цена" value={resourceData?.price}/>
                <FormField type="label" label="Итого" value={resourceData?.total}/>
            </Fields>
            <Fields cols={2} title="Маршрут">
                <FormField type="label" label="Откуда" value={resourceData?.from?.name}/>
                <FormField type="label" label="Куда" value={resourceData?.to?.name}/>
            </Fields>
            <Fields cols={3} title="Детали поездки">
                <FormField type="label" label="Поезд" value={resourceData?.train?.name}/>
                <FormField type="label" label="Вагон" value={resourceData?.wagon?.name}/>
                <FormField type="label" label="Место" value={resourceData?.seat?.name}/>
            </Fields>
            <Fields cols={1} title="Расписание">
                <FormField type="label" label="Расписание поезда" value={resourceData?.trainSchedule?.name}/>
            </Fields>
        </ResourceDetails>
    )
}
