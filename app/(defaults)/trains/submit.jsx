import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";

export default function TrainSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const resolver = yupResolver(yup.object().shape({
        name: yup.string().required("Поле обязательное*"),
        typeId: yup.string().required("Поле обязательное*"),
        zoneType: yup.mixed().oneOf([1, 2]).required("Поле обязательное*"),
        fromId: yup.string().required("Поле обязательное*"),
        toId: yup.string().required("Поле обязательное*"),
        routeId: yup.string().required("Поле обязательное*"),
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
    const typeId = watch('typeId');
    const zoneType = watch('zoneType');
    const categoryId = watch('categoryId');
    const importance = watch('importance');
    const amenities = watch('amenities');
    const fromId = watch('fromId');
    const toId = watch('toId');
    const routeId = watch('routeId');
    const periodicityId = watch('periodicityId');
    const stationsResource = useResource('stations');
    const routesResource = useResource('routes');
    const trainTypesResource = useResource('trainTypes');
    const trainCategoriesResource = useResource('trainCategories');
    const periodicitiesResource = useResource('periodicities');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields cols={2} title="Основная">
                    <FormField type="text" name="name" label="Наименование" value={name} error={errors.name?.message} trigger={trigger} onChange={value => setValue('name', value)} isValidated={true} />
                    <FormField resource={trainTypesResource} type="resourceselect" name="typeId" mode="portal" label="Тип поезда" value={typeId} error={errors.typeId?.message} trigger={trigger} onChange={value => setValue('typeId', value)} isValidated={true} isNullable={true} />
                    <FormField resource={trainCategoriesResource} type="resourceselect" name="categoryId" mode="portal" label="Категория" value={categoryId} error={errors.categoryId?.message} trigger={trigger} onChange={value => setValue('categoryId', value)} isValidated={true} />
                    <FormField
                        type="select"
                        name="zoneType"
                        label="Зональность"
                        mode="portal"
                        options={[
                            { id: 1, name: 'Пригородный' },
                            { id: 2, name: 'Общий' },
                        ]}
                        valueMemberName="id"
                        labelMemberName="name"
                        value={zoneType}
                        error={errors.zoneType?.message}
                        trigger={trigger}
                        onChange={value => setValue('zoneType', value)}
                        isValidated={true}
                        isNullable={true}
                        isNullLabel="Не указано"
                    />
                    <FormField
                        type="select"
                        name="importance"
                        label="Важность"
                        mode="portal"
                        options={[
                            { id: 1, name: 'Социально-значимый' },
                            { id: 2, name: 'Коммерческий' },
                        ]}
                        valueMemberName="id"
                        labelMemberName="name"
                        value={importance}
                        error={errors.importance?.message}
                        trigger={trigger}
                        onChange={value => setValue('importance', value)}
                        isValidated={true}
                        isNullable={true}
                        isNullLabel="Не указано"
                    />
                    <FormField
                        type="select"
                        name="amenities"
                        label="Комфорт пассажира"
                        mode="portal"
                        options={[
                            { id: 1, name: 'вагон-ресторан' },
                            { id: 2, name: 'вагон-бар' },
                        ]}
                        valueMemberName="id"
                        labelMemberName="name"
                        value={amenities}
                        error={errors.amenities?.message}
                        trigger={trigger}
                        onChange={value => setValue('amenities', value)}
                        isValidated={true}
                        isNullable={true}
                        isNullLabel="Не указано"
                    />
                </Fields>
                <Fields cols={3} title="Маршрут">
                    <FormField resource={routesResource} type="resourceselect" name="routeId" mode="portal" label="Маршрут" value={routeId} error={errors.routeId?.message} trigger={trigger} onChange={value => setValue('routeId', value)} isValidated={true} isNullable={true} />
                    <FormField resource={stationsResource} type="resourceselect" name="fromId" mode="portal" label="Станция отправления" value={fromId} error={errors.fromId?.message} trigger={trigger} onChange={value => setValue('fromId', value)} isValidated={true} isNullable={true} />
                    <FormField resource={stationsResource} type="resourceselect" name="toId" mode="portal" label="Станция прибытия" value={toId} error={errors.toId?.message} trigger={trigger} onChange={value => setValue('toId', value)} isValidated={true} isNullable={true} />
                </Fields>
                <Fields cols={1} title="Периодичность">
                    <FormField resource={periodicitiesResource} type="resourceselect" name="periodicityId" mode="portal" label="Периодичность" value={periodicityId} error={errors.periodicityId?.message} trigger={trigger} onChange={value => setValue('periodicityId', value)} isValidated={true} />
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
