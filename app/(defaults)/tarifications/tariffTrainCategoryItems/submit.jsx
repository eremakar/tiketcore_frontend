import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";

export default function TariffTrainCategoryItemSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        indexCoefficient: yup.string().required("Поле обязательное*"),
        trainCategoryId: yup.string().required("Поле обязательное*"),
        tariffId: yup.string().required("Поле обязательное*"),
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

    const indexCoefficient = watch('indexCoefficient');
    const trainCategoryId = watch('trainCategoryId');
    const tariffId = watch('tariffId');
    const trainCategoriesResource = useResource('trainCategories', 'tarifications');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="number" name="indexCoefficient" label="IndexCoefficient" value={indexCoefficient} error={errors.indexCoefficient?.message} trigger={trigger} onChange={value => setValue('indexCoefficient', value)} isValidated={true} />
                    <FormField resource={trainCategoriesResource} type="resourceselect" name="trainCategoryId" mode="portal" label="TrainCategory" value={trainCategoryId} error={errors.trainCategoryId?.message} trigger={trigger} onChange={value => setValue('trainCategoryId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
