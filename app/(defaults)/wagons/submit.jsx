import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";

export default function WagonSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        type: yup.string().required("Поле обязательное*"),
        seatCount: yup.string().required("Поле обязательное*"),
        pictureS3: yup.string().required("Поле обязательное*"),
        class: yup.string().required("Поле обязательное*"),
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

    const type = watch('type');
    const seatCount = watch('seatCount');
    const pictureS3 = watch('pictureS3');
    const class = watch('class');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="text" name="type" label="Type" value={type} error={errors.type?.message} trigger={trigger} onChange={value => setValue('type', value)} isValidated={true} />
                    <FormField type="number" name="seatCount" label="SeatCount" value={seatCount} error={errors.seatCount?.message} trigger={trigger} onChange={value => setValue('seatCount', value)} isValidated={true} />
                    <FormField type="text" name="pictureS3.id" label="PictureS3" />
                    <FormField type="text" name="class" label="Class" value={class} error={errors.class?.message} trigger={trigger} onChange={value => setValue('class', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
