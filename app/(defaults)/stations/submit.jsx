import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";

export default function StationSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        name: yup.string().required("Поле обязательное*"),
        code: yup.string().required("Поле обязательное*"),
        shortName: yup.string().required("Поле обязательное*"),
        shortNameLatin: yup.string().required("Поле обязательное*"),
        depots: yup.string().required("Поле обязательное*"),
        isCity: yup.string().required("Поле обязательное*"),
        cityCode: yup.string().required("Поле обязательное*"),
        isSalePoint: yup.string().required("Поле обязательное*"),
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
    const code = watch('code');
    const shortName = watch('shortName');
    const shortNameLatin = watch('shortNameLatin');
    const depots = watch('depots');
    const isCity = watch('isCity');
    const cityCode = watch('cityCode');
    const isSalePoint = watch('isSalePoint');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="text" name="name" label="Name" value={name} error={errors.name?.message} trigger={trigger} onChange={value => setValue('name', value)} isValidated={true} />
                    <FormField type="text" name="code" label="Code" value={code} error={errors.code?.message} trigger={trigger} onChange={value => setValue('code', value)} isValidated={true} />
                    <FormField type="text" name="shortName" label="ShortName" value={shortName} error={errors.shortName?.message} trigger={trigger} onChange={value => setValue('shortName', value)} isValidated={true} />
                    <FormField type="text" name="shortNameLatin" label="ShortNameLatin" value={shortNameLatin} error={errors.shortNameLatin?.message} trigger={trigger} onChange={value => setValue('shortNameLatin', value)} isValidated={true} />
                    <FormField type="text" name="depots.id" label="Depots" />
                    <FormField type="boolean" name="isCity" label="IsCity" value={isCity} error={errors.isCity?.message} trigger={trigger} onChange={value => setValue('isCity', value)} isValidated={true} />
                    <FormField type="text" name="cityCode" label="CityCode" value={cityCode} error={errors.cityCode?.message} trigger={trigger} onChange={value => setValue('cityCode', value)} isValidated={true} />
                    <FormField type="boolean" name="isSalePoint" label="IsSalePoint" value={isSalePoint} error={errors.isSalePoint?.message} trigger={trigger} onChange={value => setValue('isSalePoint', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
