import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";

export default function SeatTariffSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        name: yup.string().required("Поле обязательное*"),
        price: yup.string().required("Поле обязательное*"),
        baseFareId: yup.string().required("Поле обязательное*"),
        trainId: yup.string().required("Поле обязательное*"),
        trainCategoryId: yup.string().required("Поле обязательное*"),
        wagonClassId: yup.string().required("Поле обязательное*"),
        seasonId: yup.string().required("Поле обязательное*"),
        seatTypeId: yup.string().required("Поле обязательное*"),
        connectionId: yup.string().required("Поле обязательное*"),
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

    const name = watch('name');
    const price = watch('price');
    const baseFareId = watch('baseFareId');
    const trainId = watch('trainId');
    const trainCategoryId = watch('trainCategoryId');
    const wagonClassId = watch('wagonClassId');
    const seasonId = watch('seasonId');
    const seatTypeId = watch('seatTypeId');
    const connectionId = watch('connectionId');
    const baseFaresResource = useResource('baseFares');
    const trainsResource = useResource('trains');
    const trainCategoriesResource = useResource('trainCategories');
    const wagonClassesResource = useResource('wagonClasses');
    const seasonsResource = useResource('seasons');
    const seatTypesResource = useResource('seatTypes');
    const connectionsResource = useResource('connections');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="text" name="name" label="Name" value={name} error={errors.name?.message} trigger={trigger} onChange={value => setValue('name', value)} isValidated={true} />
                    <FormField type="number" name="price" label="Price" value={price} error={errors.price?.message} trigger={trigger} onChange={value => setValue('price', value)} isValidated={true} />
                    <FormField resource={baseFaresResource} type="resourceselect" name="baseFareId" mode="portal" label="BaseFare" value={baseFareId} error={errors.baseFareId?.message} trigger={trigger} onChange={value => setValue('baseFareId', value)} isValidated={true} />
                    <FormField resource={trainsResource} type="resourceselect" name="trainId" mode="portal" label="Train" value={trainId} error={errors.trainId?.message} trigger={trigger} onChange={value => setValue('trainId', value)} isValidated={true} />
                    <FormField resource={trainCategoriesResource} type="resourceselect" name="trainCategoryId" mode="portal" label="TrainCategory" value={trainCategoryId} error={errors.trainCategoryId?.message} trigger={trigger} onChange={value => setValue('trainCategoryId', value)} isValidated={true} />
                    <FormField resource={wagonClassesResource} type="resourceselect" name="wagonClassId" mode="portal" label="WagonClass" value={wagonClassId} error={errors.wagonClassId?.message} trigger={trigger} onChange={value => setValue('wagonClassId', value)} isValidated={true} />
                    <FormField resource={seasonsResource} type="resourceselect" name="seasonId" mode="portal" label="Season" value={seasonId} error={errors.seasonId?.message} trigger={trigger} onChange={value => setValue('seasonId', value)} isValidated={true} />
                    <FormField resource={seatTypesResource} type="resourceselect" name="seatTypeId" mode="portal" label="SeatType" value={seatTypeId} error={errors.seatTypeId?.message} trigger={trigger} onChange={value => setValue('seatTypeId', value)} isValidated={true} />
                    <FormField resource={connectionsResource} type="resourceselect" name="connectionId" mode="portal" label="соединение станций" value={connectionId} error={errors.connectionId?.message} trigger={trigger} onChange={value => setValue('connectionId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
