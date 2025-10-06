import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useEffect, useState } from "react";
import useResource from "@/hooks/useResource";

export default function WagonDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    const wagonFeaturesResource = useResource('wagonFeatures');
    const seatTypesResource = useResource('seatTypes');
    const seatPurposesResource = useResource('seatPurposes');
    const [allWagonFeatures, setAllWagonFeatures] = useState([]);
    const [selectedFeatureIds, setSelectedFeatureIds] = useState([]);
    const [seatTypes, setSeatTypes] = useState([]);
    const [seatPurposes, setSeatPurposes] = useState([]);
    const [seats, setSeats] = useState([]);

    // Load related data
    useEffect(() => {
        const loadRelatedData = async () => {
            try {
                // Load all wagon features
                const allFeaturesResponse = await wagonFeaturesResource.search({ paging: { skip: 0, take: 1000 } });
                setAllWagonFeatures(allFeaturesResponse?.result || []);
                
                // Get selected feature IDs
                if (resourceData?.features && Array.isArray(resourceData.features)) {
                    const selectedIds = resourceData.features.map(f => f.featureId);
                    setSelectedFeatureIds(selectedIds);
                } else {
                    setSelectedFeatureIds([]);
                }

                // Load seat types
                const seatTypesResponse = await seatTypesResource.search({ paging: { skip: 0, take: 1000 } });
                setSeatTypes(seatTypesResponse?.result || []);

                // Load seat purposes
                const seatPurposesResponse = await seatPurposesResource.search({ paging: { skip: 0, take: 1000 } });
                setSeatPurposes(seatPurposesResponse?.result || []);

                // Load seats
                if (resourceData?.seats && Array.isArray(resourceData.seats)) {
                    setSeats(resourceData.seats);
                }
            } catch (e) {
                console.error('Error loading related data:', e);
            }
        };

        if (show && resourceData) {
            loadRelatedData();
        }
    }, [show, resourceData]);

    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <Fields>
                <FormField 
                    type="label" 
                    label="Наименование" 
                    value={resourceData?.name || 'Не указано'}
                />
                <FormField 
                    type="label" 
                    label="Тип" 
                    value={resourceData?.type?.name || 'Не указано'}
                />
                <FormField 
                    type="label" 
                    label="Класс" 
                    value={resourceData?.class?.name || 'Не указано'}
                />
                <FormField 
                    type="label" 
                    label="Количество мест" 
                    value={resourceData?.seatCount || '0'}
                />
                {allWagonFeatures.length > 0 && (
                    <div className="flex sm:flex-row flex-col" style={{alignItems: 'flex-start'}}>
                        <label className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">Особенности</label>
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {allWagonFeatures.map((feature, index) => {
                                    const isSelected = selectedFeatureIds.includes(feature.id);
                                    return (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                                                isSelected 
                                                    ? 'bg-green-100 text-green-800 border-green-200' 
                                                    : 'bg-blue-100 text-blue-800 border-blue-200'
                                            }`}>
                                                {feature.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
                {/* {resourceData?.pictureS3 && (
                    <div className="flex sm:flex-row flex-col" style={{alignItems: 'flex-start'}}>
                        <label className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">Фото</label>
                        <div className="w-full">
                            <img 
                                src={resourceData.pictureS3.url || resourceData.pictureS3} 
                                alt="Фото вагона"
                                className="max-w-xs max-h-48 object-contain rounded-lg border"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>
                )} */}
                {seats.length > 0 && (
                    <div className="mt-4">
                        <div className="flex sm:flex-row flex-col" style={{alignItems: 'flex-start'}}>
                            <label className="mb-2 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">Места</label>
                            <div className="w-full">
                                <div className="table-responsive">
                                    <table className="table-hover">
                                        <thead>
                                            <tr>
                                                <th>Номер места</th>
                                                <th>Тип места</th>
                                                <th>Назначение</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {seats.map((seat, index) => {
                                                const seatType = seatTypes.find(st => st.id === seat.typeId);
                                                const seatPurpose = seatPurposes.find(sp => sp.id === seat.purposeId);
                                                return (
                                                    <tr key={index}>
                                                        <td>{seat.number}</td>
                                                        <td>{seatType?.name || 'Не указано'}</td>
                                                        <td>{seatPurpose?.name || 'Не указано'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Fields>
        </ResourceDetails>
    )
}
