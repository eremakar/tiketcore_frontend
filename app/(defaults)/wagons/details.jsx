import ResourceDetails from "@/components/genA/resourceDetails";
import Fields from "@/components/genA/fields";
import FormField from "@/components/genA/FormField";
import { useEffect, useState } from "react";
import useResource from "@/hooks/useResource";
import IconRouter from "@/components/icon/icon-router";
import IconBolt from "@/components/icon/icon-bolt";
import IconSun from "@/components/icon/icon-sun";
import IconDroplet from "@/components/icon/icon-droplet";
import IconWheel from "@/components/icon/icon-wheel";
import IconCoffee from "@/components/icon/icon-coffee";
import IconBox from "@/components/icon/icon-box";
import IconMoon from "@/components/icon/icon-moon";
import IconMoodSmile from "@/components/icon/icon-mood-smile";
import IconStar from "@/components/icon/icon-star";
import IconInfoCircle from "@/components/icon/icon-info-circle";
import IconUser from "@/components/icon/icon-user";
import IconBed from "@/components/icon/icon-bed-flat";

export default function WagonDetails({show, setShow, resourceName, resource, resourceData, orientation, type}) {
    const wagonFeaturesResource = useResource('wagonFeatures');
    const seatTypesResource = useResource('seatTypes');
    const seatPurposesResource = useResource('seatPurposes');
    const [allWagonFeatures, setAllWagonFeatures] = useState([]);
    const [selectedFeatureIds, setSelectedFeatureIds] = useState([]);
    const [seatTypes, setSeatTypes] = useState([]);
    const [seatPurposes, setSeatPurposes] = useState([]);
    const [seats, setSeats] = useState([]);
    const [seatTypeCounts, setSeatTypeCounts] = useState([]);
    const [disabledSeatCount, setDisabledSeatCount] = useState(0);
    const imageUrl = (resourceData?.pictureS3 && (resourceData.pictureS3.url || resourceData.pictureS3)) || '/wagon.jpg';

    const getFeatureIcon = (label) => {
        const n = (label || '').toLowerCase();
        if (n.includes('wi') || n.includes('вайф') || n.includes('wi-fi') || n.includes('интернет') || n.includes('роутер')) return <IconRouter className="w-4 h-4" />;
        if (n.includes('розет') || n.includes('элект') || n.includes('питан') || n.includes('заряд')) return <IconBolt className="w-4 h-4" />;
        if (n.includes('кондицион') || n.includes('климат') || n.includes('температ') || n.includes('жар') || n.includes('охлаж')) return <IconSun className="w-4 h-4" />;
        if (n.includes('туал') || n.includes('сануз') || n.includes('уборн') || n.includes('гигиен')) return <IconDroplet className="w-4 h-4" />;
        if (n.includes('инвалид') || n.includes('коляс') || n.includes('маломоб') || n.includes('доступ')) return <IconWheel className="w-4 h-4" />;
        if (n.includes('кафе') || n.includes('бар') || n.includes('рестор') || n.includes('еда') || n.includes('напит')) return <IconCoffee className="w-4 h-4" />;
        if (n.includes('багаж') || n.includes('чемод') || n.includes('полка')) return <IconBox className="w-4 h-4" />;
        if (n.includes('тих')) return <IconMoon className="w-4 h-4" />;
        if (n.includes('дет') || n.includes('ребен') || n.includes('семейн')) return <IconMoodSmile className="w-4 h-4" />;
        if (n.includes('прем') || n.includes('люкс') || n.includes('перв')) return <IconStar className="w-4 h-4" />;
        return <IconInfoCircle className="w-4 h-4" />;
    };

    const getPurposeTextClass = (name) => {
        const n = (name || '').toLowerCase();
        if (n.includes('инвалид')) return 'text-orange-600';
        if (n.includes('проводник')) return 'text-blue-600';
        if (n.includes('пассажир')) return 'text-green-600';
        return 'text-slate-700';
    };

    const SeatIcon = <IconBed className="w-4 h-4" />;

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

    // Calculate counts per seat type when seats or seatTypes change
    useEffect(() => {
        if (!seats || seats.length === 0 || !seatTypes || seatTypes.length === 0) {
            setSeatTypeCounts([]);
            return;
        }
        const typeIdToName = new Map(seatTypes.map(st => [st.id, st.name || '']));
        const countsMap = new Map();
        for (const seat of seats) {
            const name = typeIdToName.get(seat.typeId) || 'Не указано';
            countsMap.set(name, (countsMap.get(name) || 0) + 1);
        }
        const countsArr = Array.from(countsMap.entries()).map(([name, count]) => ({ name, count }));
        setSeatTypeCounts(countsArr);
    }, [seats, seatTypes]);

    // Calculate disabled seats count based on seat purposes
    useEffect(() => {
        if (!seats || seats.length === 0 || !seatPurposes || seatPurposes.length === 0) {
            setDisabledSeatCount(0);
            return;
        }
        const purposeIdToName = new Map(seatPurposes.map(sp => [sp.id, sp.name || '']));
        let disabled = 0;
        for (const seat of seats) {
            const name = (purposeIdToName.get(seat.purposeId) || '').toLowerCase();
            if (name.includes('инвалид')) disabled++;
        }
        setDisabledSeatCount(disabled);
    }, [seats, seatPurposes]);

    return (
        <ResourceDetails resource={resource} show={show} setShow={setShow} resourceName={resourceName} resourceData={resourceData}>
            <Fields>
                <div className="flex sm:flex-row flex-col gap-4" style={{alignItems: 'flex-start'}}>
                    <div className="w-full sm:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-600">Наименование</span>
                                <span className="text-sm font-medium">{resourceData?.name || 'Не указано'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-600">Тип</span>
                                <span className="text-sm font-medium">{resourceData?.type?.name || 'Не указано'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-600">Класс</span>
                                <span className="text-sm font-medium">{resourceData?.class?.name || 'Не указано'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-600">Количество мест</span>
                                <span className="text-sm font-medium">
                                    {resourceData?.seatCount || '0'}
                                    {seatTypeCounts.length ? ` (${seatTypeCounts.map(i => `${i.name}: ${i.count}`).join(', ')})` : ''}
                                </span>
                                <span className="text-sm">мест для инвалидов: <span className="font-medium">{disabledSeatCount}</span></span>
                            </div>
                        </div>
                        {allWagonFeatures.length > 0 && selectedFeatureIds.length > 0 && (
                            <div className="mt-6">
                                <div className="rounded-md border border-slate-200 p-3">
                                    <div className="text-sm font-medium mb-2">Особенности</div>
                                    <div className="grid grid-flow-col grid-rows-3 gap-2">
                                        {allWagonFeatures
                                            .filter(feature => selectedFeatureIds.includes(feature.id))
                                            .map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-green-100 text-green-800 border-green-200">
                                                        <span className="mr-2 inline-flex items-center">{getFeatureIcon(feature.name)}</span>
                                                        {feature.name}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-full sm:w-1/3">
                        <div className="w-full flex sm:justify-end">
                            <img 
                                src={imageUrl}
                                alt="Фото вагона"
                                className="w-full max-h-64 object-cover rounded-lg border"
                                onError={(e) => { e.target.src = '/wagon.jpg'; }}
                            />
                        </div>
                    </div>
                </div>
                
                
                {seats.length > 0 && (
                    <div className="mt-4">
                        <div className="flex sm:flex-row flex-col" style={{alignItems: 'flex-start'}}>
                            <div className="w-full">
                                <div className="table-responsive">
                                    <table className="table-hover">
                                        <thead>
                                            <tr>
                                                <th className="text-center">Номер места</th>
                                                <th className="text-center">Тип места</th>
                                                <th className="text-center">Назначение</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {seats.map((seat, index) => {
                                                const seatType = seatTypes.find(st => st.id === seat.typeId);
                                                const seatPurpose = seatPurposes.find(sp => sp.id === seat.purposeId);
                                                return (
                                                    <tr key={index}>
                                                        <td className="text-center">
                                                            <span className="inline-flex items-center justify-center gap-2">
                                                                {SeatIcon}
                                                                {String(seat.number).padStart(2, '0')}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">{seatType?.name || 'Не указано'}</td>
                                                        <td className={`text-center ${getPurposeTextClass(seatPurpose?.name)}`}>{seatPurpose?.name || 'Не указано'}</td>
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
