'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useEffect, useState } from "react";
import StationLookup from "@/app/(defaults)/stations/lookup";
import RouteLookup from "@/app/(defaults)/routes/lookup";
import TrainWagonsPlanLookup from "@/app/(defaults)/trainWagonsPlans/lookup";
import TrainCategoryLookup from "@/app/(defaults)/tarifications/trainCategories/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";

export default function Trains() {
    const [query, setQuery] = useState({
        paging: { skip: 0, take: 10 },
        filter: {},
        sort: {
            id: {
                operator: 'desc'
            }
        }
    });

    const [data, setData] = useState(null);
    const resourceActionPostfix = "поезд";

    const [stations, setStations] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [trainWagonsPlans, setTrainWagonsPlans] = useState([]);
    const [trainCategories, setTrainCategories] = useState([]);
    const stationsResource = useResource('stations');
    const routesResource = useResource('routes');
    const trainWagonsPlansResource = useResource('trainWagonsPlans');
    const trainCategoriesResource = useResource('trainCategories');

    useEffect(() => {
        const loadRefs = async () => {
            try {
                const [stRes, rtRes, twpRes, tcRes] = await Promise.all([
                    stationsResource.search({ paging: { skip: 0 } }),
                    routesResource.search({ paging: { skip: 0 } }),
                    trainWagonsPlansResource.search({ paging: { skip: 0 } }),
                    trainCategoriesResource.search({ paging: { skip: 0 } })
                ]);
                setStations(stRes?.result || []);
                setRoutes(rtRes?.result || []);
                setTrainWagonsPlans(twpRes?.result || []);
                setTrainCategories(tcRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        loadRefs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('trains')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode="default"
                sortMode="default"
                leftActions={true}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                    { key: 'name', title: 'Name', isSortable: true, editable: true, type: viewTypeIds.text },
                    { key: 'type', title: 'Тип поезда, например Тальго', isSortable: true, editable: true, type: viewTypeIds.text },
                    { key: 'zoneType', title: 'Зональность: пригородный, общий и т.п.', isSortable: true, editable: true, type: viewTypeIds.text },
                    {
                        key: 'from',
                        title: 'From',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: stations,
                            relationMemberName: 'fromId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
                    {
                        key: 'to',
                        title: 'To',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: stations,
                            relationMemberName: 'toId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
                    {
                        key: 'route',
                        title: 'Route',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: routes,
                            relationMemberName: 'routeId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
                    {
                        key: 'plan',
                        title: 'Plan',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: trainWagonsPlans,
                            relationMemberName: 'planId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
                    {
                        key: 'category',
                        title: 'Category',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: trainCategories,
                            relationMemberName: 'categoryId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        operator: 'like',
                    },
                    {
                        title: 'Тип поезда, например Тальго',
                        key: 'type',
                    },
                    {
                        title: 'Зональность: пригородный, общий и т.п.',
                        key: 'zoneType',
                    },
                    {
                        title: 'FromId',
                        key: 'fromId',
                        renderField: (fieldProps) => <StationLookup resource={stationsResource} {...fieldProps} />,
                    },
                    {
                        title: 'ToId',
                        key: 'toId',
                        renderField: (fieldProps) => <StationLookup resource={stationsResource} {...fieldProps} />,
                    },
                    {
                        title: 'RouteId',
                        key: 'routeId',
                        renderField: (fieldProps) => <RouteLookup resource={routesResource} {...fieldProps} />,
                    },
                    {
                        title: 'TrainWagonsPlanId',
                        key: 'trainWagonsPlanId',
                        renderField: (fieldProps) => <TrainWagonsPlanLookup resource={trainWagonsPlansResource} {...fieldProps} />,
                    },
                    {
                        title: 'TrainCategoryId',
                        key: 'trainCategoryId',
                        renderField: (fieldProps) => <TrainCategoryLookup resource={trainCategoriesResource} {...fieldProps} />,
                    },
                ]}
            />
        </>
    )
}
