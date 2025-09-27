import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import { FormSection } from "@/components/genA/formSection";
import useResource from "@/hooks/useResource";
import { useState } from "react";
import MultiLookup from "@/components/genA/multiLookup";

export default function UserSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type}) {
    const [selectedRoles, setSelectedRoles] = useState([]);

    const resolver = yupResolver(yup.object().shape({
        userName: yup.string().required("Поле обязательное*"),
        passwordHash: yup.string().required("Поле обязательное*"),
        isActive: yup.string().required("Поле обязательное*"),
        protectFromBruteforceAttempts: yup.string().required("Поле обязательное*"),
        fullName: yup.string().required("Поле обязательное*"),
        positionName: yup.string().required("Поле обязательное*"),
        roleId: yup.string().required("Поле обязательное*"),
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

    const userName = watch('userName');
    const passwordHash = watch('passwordHash');
    const isActive = watch('isActive');
    const protectFromBruteforceAttempts = watch('protectFromBruteforceAttempts');
    const fullName = watch('fullName');
    const positionName = watch('positionName');
    const roleId = watch('roleId');
    const rolesResource = useResource('roles');
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }}>
            <HookForm methods={methods} data={resourceData}>
                <Fields>
                    <FormSection type="expandable" title="Учетные данные">
                        <Fields cols="2">
                            <FormField type="text" name="passwordHash" label="Хеш пароля" value={passwordHash} error={errors.passwordHash?.message} trigger={trigger} onChange={value => setValue('passwordHash', value)} isValidated={true} />
                            <FormField type="text" name="userName" label="Имя пользователя" value={userName} error={errors.userName?.message} trigger={trigger} onChange={value => setValue('userName', value)} isValidated={true} />
                        </Fields>
                    </FormSection>
                    <FormSection type="expandable" title="Служебные">
                        <Fields cols="2">
                            <FormField type="number" name="protectFromBruteforceAttempts" label="Количество попыток входа" value={protectFromBruteforceAttempts} error={errors.protectFromBruteforceAttempts?.message} trigger={trigger} onChange={value => setValue('protectFromBruteforceAttempts', value)} isValidated={true} />
                            <FormField type="boolean" name="isActive" label="Активен ли пользователь" value={isActive} error={errors.isActive?.message} trigger={trigger} onChange={value => setValue('isActive', value)} isValidated={true} />
                        </Fields>
                    </FormSection>
                    <FormSection type="expandable" title="Контактные данные">
                        <Fields cols="2">
                            <FormField type="text" name="positionName" label="Название должности" value={positionName} error={errors.positionName?.message} trigger={trigger} onChange={value => setValue('positionName', value)} isValidated={true} />
                            <FormField type="text" name="fullName" label="Ф.И.О" value={fullName} error={errors.fullName?.message} trigger={trigger} onChange={value => setValue('fullName', value)} isValidated={true} />
                        </Fields>
                    </FormSection>
                    {(!resourceMode || resourceMode == 'create') && <FormSection type="expandable" title="Роли">
                        <Fields cols={2}>
                            <div>Роли:
                            {selectedRoles.map(role => <div>{role.name}</div>)}
                            </div>
                            <MultiLookup name="roles" options={{
                                table: {
                                    data: [
                                        { id: 1, name: 'СуперАдминистратор' },
                                        { id: 2, name: 'Администратор' },
                                        { id: 3, name: 'Оперативный отдел' },
                                        { id: 4, name: 'Операционный отдел' },
                                    ],
                                    setData: () => {},
                                    columns: [
                                        { key: 'id', title: 'Ид' },
                                        { key: 'name', title: 'Наименование' },
                                    ]
                                },
                                filters: [],
                                selectionsTable: {
                                    columns: [
                                        { key: 'id', title: 'Ид' },
                                        { key: 'name', title: 'Наименование' },
                                    ]
                                }
                            }}
                                        value={selectedRoles.sort(function(a,b){
                                            return a.id - b.id;
                                        })}
                                        onChange={(value) => {
                                            setSelectedRoles(value);
                                        }}
                            />
                        </Fields>
                    </FormSection>}
                </Fields>
            </HookForm>
        </ResourceSubmit>
    )
}
