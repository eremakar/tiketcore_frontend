import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";

export default function SeatTariffItemSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        distance: yup.string().required("Поле обязательное*"),
        price: yup.string().required("Поле обязательное*"),
        wagonClassId: yup.string().required("Поле обязательное*"),
        seasonId: yup.string().required("Поле обязательное*"),
        seatTypeId: yup.string().required("Поле обязательное*"),
        fromId: yup.string().required("Поле обязательное*"),
        toId: yup.string().required("Поле обязательное*"),
        seatTariffId: yup.string().required("Поле обязательное*"),
    }));
    const methods = useForm({
        resolver: resolver,
    });
    const {
        watch,
        setValue,
        trigger,
        formState: {errors},
        handleSubmit
    } = methods;

    const distance = watch('distance');
    const price = watch('price');
    const wagonClassId = watch('wagonClassId');
    const seasonId = watch('seasonId');
    const seatTypeId = watch('seatTypeId');
    const fromId = watch('fromId');
    const toId = watch('toId');
    const seatTariffId = watch('seatTariffId');
    const wagonClassesResource = useResource('wagonClasses', 'tarifications');
    const seasonsResource = useResource('seasons', 'tarifications');
    const seatTypesResource = useResource('seatTypes');
    const stationsResource = useResource('stations');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="number" name="distance" label="Distance" value={distance} error={errors.distance?.message} trigger={trigger} onChange={value => setValue('distance', value)} isValidated={true} />
                    <FormField type="number" name="price" label="Price" value={price} error={errors.price?.message} trigger={trigger} onChange={value => setValue('price', value)} isValidated={true} />
                    <FormField resource={wagonClassesResource} type="resourceselect" name="wagonClassId" mode="portal" label="WagonClass" value={wagonClassId} error={errors.wagonClassId?.message} trigger={trigger} onChange={value => setValue('wagonClassId', value)} isValidated={true} />
                    <FormField resource={seasonsResource} type="resourceselect" name="seasonId" mode="portal" label="Season" value={seasonId} error={errors.seasonId?.message} trigger={trigger} onChange={value => setValue('seasonId', value)} isValidated={true} />
                    <FormField resource={seatTypesResource} type="resourceselect" name="seatTypeId" mode="portal" label="SeatType" value={seatTypeId} error={errors.seatTypeId?.message} trigger={trigger} onChange={value => setValue('seatTypeId', value)} isValidated={true} />
                    <FormField resource={stationsResource} type="resourceselect" name="fromId" mode="portal" label="From" value={fromId} error={errors.fromId?.message} trigger={trigger} onChange={value => setValue('fromId', value)} isValidated={true} />
                    <FormField resource={stationsResource} type="resourceselect" name="toId" mode="portal" label="To" value={toId} error={errors.toId?.message} trigger={trigger} onChange={value => setValue('toId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
