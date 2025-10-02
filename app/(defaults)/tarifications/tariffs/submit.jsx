import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";

export default function TariffSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        name: yup.string().required("Поле обязательное*"),
        indexCoefficient: yup.string().required("Поле обязательное*"),
        vAT: yup.string().required("Поле обязательное*"),
        baseFareId: yup.string().required("Поле обязательное*"),
        trainCategoryId: yup.string().required("Поле обязательное*"),
        wagonId: yup.string().required("Поле обязательное*"),
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
    const indexCoefficient = watch('indexCoefficient');
    const vAT = watch('vAT');
    const baseFareId = watch('baseFareId');
    const trainCategoryId = watch('trainCategoryId');
    const wagonId = watch('wagonId');
    const baseFaresResource = useResource('baseFares', 'tarifications');
    const trainCategoriesResource = useResource('trainCategories', 'tarifications');
    const wagonsResource = useResource('wagonModels');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="text" name="name" label="Name" value={name} error={errors.name?.message} trigger={trigger} onChange={value => setValue('name', value)} isValidated={true} />
                    <FormField type="number" name="indexCoefficient" label="IndexCoefficient" value={indexCoefficient} error={errors.indexCoefficient?.message} trigger={trigger} onChange={value => setValue('indexCoefficient', value)} isValidated={true} />
                    <FormField type="number" name="vAT" label="VAT" value={vAT} error={errors.vAT?.message} trigger={trigger} onChange={value => setValue('vAT', value)} isValidated={true} />
                    <FormField resource={baseFaresResource} type="resourceselect" name="baseFareId" mode="portal" label="BaseFare" value={baseFareId} error={errors.baseFareId?.message} trigger={trigger} onChange={value => setValue('baseFareId', value)} isValidated={true} />
                    <FormField resource={trainCategoriesResource} type="resourceselect" name="trainCategoryId" mode="portal" label="TrainCategory" value={trainCategoryId} error={errors.trainCategoryId?.message} trigger={trigger} onChange={value => setValue('trainCategoryId', value)} isValidated={true} />
                    <FormField resource={wagonsResource} type="resourceselect" name="wagonId" mode="portal" label="Wagon" value={wagonId} error={errors.wagonId?.message} trigger={trigger} onChange={value => setValue('wagonId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
