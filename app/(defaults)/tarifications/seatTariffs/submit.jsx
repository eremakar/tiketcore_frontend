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
        trainId: yup.string().required("Поле обязательное*"),
        baseFareId: yup.string().required("Поле обязательное*"),
        trainCategoryId: yup.string().required("Поле обязательное*"),
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
    const trainId = watch('trainId');
    const baseFareId = watch('baseFareId');
    const trainCategoryId = watch('trainCategoryId');
    const trainsResource = useResource('trains');
    const baseFaresResource = useResource('baseFares', 'tarifications');
    const trainCategoriesResource = useResource('trainCategories', 'tarifications');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="text" name="name" label="Name" value={name} error={errors.name?.message} trigger={trigger} onChange={value => setValue('name', value)} isValidated={true} />
                    <FormField resource={trainsResource} type="resourceselect" name="trainId" mode="portal" label="Train" value={trainId} error={errors.trainId?.message} trigger={trigger} onChange={value => setValue('trainId', value)} isValidated={true} />
                    <FormField resource={baseFaresResource} type="resourceselect" name="baseFareId" mode="portal" label="BaseFare" value={baseFareId} error={errors.baseFareId?.message} trigger={trigger} onChange={value => setValue('baseFareId', value)} isValidated={true} />
                    <FormField resource={trainCategoriesResource} type="resourceselect" name="trainCategoryId" mode="portal" label="TrainCategory" value={trainCategoryId} error={errors.trainCategoryId?.message} trigger={trigger} onChange={value => setValue('trainCategoryId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
