import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ResourceSubmit from "@/components/genA/resourceSubmit";
import HookForm from "@/components/genA/hookForm";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useForm } from "react-hook-form";
import useResource from "@/hooks/useResource";
import { useEffect, useState } from "react";
import SeatsTable from "@/components/seats/SeatsTable";

export default function WagonSubmit({show, setShow, resourceName, resource, resourceMode, resourceData, onResourceSubmitted, orientation, type: type2}) {
    const wagonTypesResource = useResource('wagonTypes');
    const wagonClassesResource = useResource('wagonClasses');
    const wagonFeaturesResource = useResource('wagonFeatures');
    const [wagonFeatures, setWagonFeatures] = useState([]);
    const [showSeats, setShowSeats] = useState(false);
    const [seats, setSeats] = useState([]);
    const [features, setFeatures] = useState([]);
    
    const resolver = yupResolver(yup.object().shape({
        name: yup.string().required("Поле обязательное*"),
        typeId: yup.string().required("Поле обязательное*"),
        seatCount: yup.string().required("Поле обязательное*"),
        //pictureS3: yup.string().required("Поле обязательное*"),
        classId: yup.string().required("Поле обязательное*"),
        hasLiftingMechanism: yup.boolean(),
        manufacturerName: yup.string(),
    }));
    const methods = useForm({
        resolver: resolver,
    });
    const {
        watch,
        setValue,
        getValue,
        trigger,
        formState: {errors},
        handleSubmit
    } = methods;

    const name = watch('name');
    const typeId = watch('typeId');
    const seatCount = watch('seatCount');
    const pictureS3 = watch('pictureS3');
    const classId = watch('classId');
    const hasLiftingMechanism = watch('hasLiftingMechanism');
    const manufacturerName = watch('manufacturerName');

    // Load wagon features
    useEffect(() => {
        const loadWagonFeatures = async () => {
            try {
                const response = await wagonFeaturesResource.search({ paging: { skip: 0, take: 1000 } });
                setWagonFeatures(response?.result || []);
            } catch (e) {
                console.error('Error loading wagon features:', e);
            }
        };
        loadWagonFeatures();
    }, []);

    // Clear seats and features when form is opened
    useEffect(() => {
        if (show) {
            setValue('seatCount', null);
            setSeats([]);
            setShowSeats(false);
            
            // Load features from resourceData if available
            if (resourceData?.features && Array.isArray(resourceData.features)) {
                const featureIds = resourceData.features.map(feature => feature.featureId);
                setFeatures(featureIds);
            } else {
                setFeatures([]);
            }
            
            // Load seats from resourceData if available
            if (resourceData?.seats && Array.isArray(resourceData.seats)) {
                setSeats(resourceData.seats);
                setShowSeats(true);
            }
        }
    }, [show, resourceData]);


    const handleCreateSeats = () => {
        const count = parseInt(seatCount);
        if (count && count > 0) {
            const existingSeats = resourceData?.seats || [];
            const existingSeatsMap = new Map(existingSeats.map(seat => [parseInt(seat.number), seat]));
            
            const newSeats = Array.from({ length: count }, (_, index) => {
                const seatId = index + 1;
                const existingSeat = existingSeatsMap.get(seatId);
                
                if (existingSeat) {
                    return existingSeat;
                }
                
                return {
                    id: 0,
                    number: seatId.toString(),
                    class: 1,
                    wagonId: null,
                    typeId: null
                };
            });
            
            setSeats(newSeats);
            setShowSeats(true);
        }
    };
    return (
        <ResourceSubmit resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceMode={resourceMode} resourceData={resourceData} onResourceSubmitted={onResourceSubmitted} onSubmit={async handler => { handleSubmit(handler)(); }} submitTitle="Создать" submitButtonClass="btn btn-success">
            <HookForm methods={methods} data={resourceData} validateOnInput={false}>
                <div className="space-y-5">
                    <Fields cols={2} title="Основная">
                        <FormField type="text" name="name" label="Наименование" value={name} error={errors.name?.message} trigger={trigger} onChange={value => setValue('name', value)} isValidated={true} validateOnInput={false} />
                        <FormField resource={wagonTypesResource} type="resourceselect" name="typeId" mode="portal" label="Тип" value={typeId} error={errors.typeId?.message} trigger={trigger} onChange={value => setValue('typeId', value)} isValidated={true} validateOnInput={false} />
                        <FormField resource={wagonClassesResource} type="resourceselect" name="classId" mode="portal" label="Класс" value={classId} error={errors.classId?.message} trigger={trigger} onChange={value => setValue('classId', value)} isValidated={true} validateOnInput={false} />
                        <FormField type="checkbox" name="hasLiftingMechanism" label="Наличие подъемного механизма" value={hasLiftingMechanism} error={errors.hasLiftingMechanism?.message} trigger={trigger} onChange={value => setValue('hasLiftingMechanism', value)} isValidated={false} validateOnInput={false} />
                        <FormField type="text" name="manufacturerName" label="Завод изготовитель" value={manufacturerName} error={errors.manufacturerName?.message} trigger={trigger} onChange={value => setValue('manufacturerName', value)} isValidated={false} validateOnInput={false} />
                    </Fields>
                    
                    <Fields cols={1} title="Особенности">
                        <FormField type="multicheckbox" orientation="vertical" name="features" value={features} error={errors.features?.message} trigger={trigger} onChange={value => {
                            console.log(value);
                            setFeatures(value);
                            const existingFeatures = resourceData?.features || [];
                            const formattedFeatures = value.map(id => {
                                const existingFeature = existingFeatures.find(f => f.featureId === id);
                                return existingFeature ? { ...existingFeature, featureId: id } : { featureId: id };
                            });
                            setValue('features', formattedFeatures);
                        }} options={{ items: wagonFeatures.map(feature => ({ value: feature.id, label: feature.name })), columns: 2 }} isValidated={true} validateOnInput={false} />
                    </Fields>
                    
                    <Fields cols={1} title="Количество мест">
                        <FormField
                            orientation="vertical"
                            type="number" 
                            name="seatCount"
                            value={seatCount} 
                            error={errors.seatCount?.message} 
                            trigger={trigger} 
                            onChange={value => setValue('seatCount', value)} 
                            isValidated={true}
                            validateOnInput={false}
                            addon={
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={handleCreateSeats}
                                    disabled={!seatCount || parseInt(seatCount) <= 0}
                                >
                                    Создать
                                </button>
                            }
                        />
                        {showSeats && (
                            <SeatsTable 
                                seats={seats}
                                setSeats={setSeats}
                                onSeatsChange={(updatedSeats) => {
                                    setSeats(updatedSeats);
                                    console.log(updatedSeats);
                                    setValue('seats', updatedSeats);
                                }}
                            />
                        )}
                    </Fields>
                    {/* <FormField type="text" name="pictureS3.id" label="фото" />  */}
                </div>
            </HookForm>
        </ResourceSubmit>
    )
}
