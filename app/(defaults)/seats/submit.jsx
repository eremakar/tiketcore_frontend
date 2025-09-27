import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";

export default function SeatSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        number: yup.string().required("Поле обязательное*"),
        class: yup.string().required("Поле обязательное*"),
        wagonId: yup.string().required("Поле обязательное*"),
        typeId: yup.string().required("Поле обязательное*"),
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

    const number = watch('number');
    const class = watch('class');
    const wagonId = watch('wagonId');
    const typeId = watch('typeId');
    const trainWagonsResource = useResource('trainWagons');
    const seatTypesResource = useResource('seatTypes');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormField type="text" name="number" label="Number" value={number} error={errors.number?.message} trigger={trigger} onChange={value => setValue('number', value)} isValidated={true} />
                    <FormField type="number" name="class" label="Class" value={class} error={errors.class?.message} trigger={trigger} onChange={value => setValue('class', value)} isValidated={true} />
                    <FormField resource={trainWagonsResource} type="resourceselect" name="wagonId" mode="portal" label="Wagon" value={wagonId} error={errors.wagonId?.message} trigger={trigger} onChange={value => setValue('wagonId', value)} isValidated={true} />
                    <FormField resource={seatTypesResource} type="resourceselect" name="typeId" mode="portal" label="Тип места: верхний/боковой/нижний" value={typeId} error={errors.typeId?.message} trigger={trigger} onChange={value => setValue('typeId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
