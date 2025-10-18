'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useEffect, useState } from "react";
import StationLookup from "@/app/(defaults)/stations/lookup";
import RouteLookup from "@/app/(defaults)/routes/lookup";
import TrainWagonsPlanLookup from "@/app/(defaults)/trainWagonsPlans/lookup";
import TrainCategoryLookup from "@/app/(defaults)/tarifications/trainCategories/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import TrainSubmit from "./submit";
import TrainDetails from "./details";

export default function Trains() {
    const [query, setQuery] = useState({
        paging: { skip: 0, take: 100 },
        filter: {},
        sort: {
            id: {
                operator: 'desc'
            }
        }
    });

    const [createShow, setCreateShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [detailsShow, setDetailsShow] = useState(false);

    const [data, setData] = useState(null);
    const [row, setRow] = useState(null);
    const [newRow, setNewRow] = useState({});
    const resourceActionPostfix = "поезд";

    const [stations, setStations] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [trainWagonsPlans, setTrainWagonsPlans] = useState([]);
    const [trainCategories, setTrainCategories] = useState([]);
    const [trainTypes, setTrainTypes] = useState([]);
    const [periodicities, setPeriodicities] = useState([]);
    const stationsResource = useResource('stations');
    const routesResource = useResource('routes');
    const trainWagonsPlansResource = useResource('trainWagonsPlans');
    const trainCategoriesResource = useResource('trainCategories');
    const trainTypesResource = useResource('trainTypes');
    const periodicitiesResource = useResource('periodicities');
    const trainsResource = useResource('trains');

    useEffect(() => {
        const loadRefs = async () => {
            try {
                const [stRes, rtRes, twpRes, tcRes, ttRes, perRes] = await Promise.all([
                    stationsResource.search({ paging: { skip: 0 } }),
                    routesResource.search({ paging: { skip: 0 } }),
                    trainWagonsPlansResource.search({ paging: { skip: 0 } }),
                    trainCategoriesResource.search({ paging: { skip: 0 } }),
                    trainTypesResource.search({ paging: { skip: 0 } }),
                    periodicitiesResource.search({ paging: { skip: 0 } })
                ]);
                setStations(stRes?.result || []);
                setRoutes(rtRes?.result || []);
                setTrainWagonsPlans(twpRes?.result || []);
                setTrainCategories(tcRes?.result || []);
                setTrainTypes(ttRes?.result || []);
                setPeriodicities(perRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        loadRefs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetch = () => {
        setQuery({ ...query });
    }
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
                leftActions={false}
                enableCellEditOnDoubleClick={false}
                actions={{
                    onCreate: () => setCreateShow(true),
                    onEdit: (wrappedRow) => {
                        setRow({ ...wrappedRow.row });
                        setEditShow(true);
                    },
                    onDetails: (wrappedRow) => {
                        setRow({ ...wrappedRow.row });
                        setDetailsShow(true);
                    }
                }}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                    { key: 'name', title: 'Название', isSortable: true, editable: true, type: viewTypeIds.text },
                    {
                        key: 'type',
                        title: 'Тип поезда',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: trainTypes,
                            relationMemberName: 'typeId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.name
                    },
                    {
                        key: 'zoneType',
                        title: 'Зональность',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: [
                                { id: 1, name: 'Пригородный' },
                                { id: 2, name: 'Общий' },
                            ],
                            primitive: true,
                            props: { labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => ({ 1: 'Пригородный', 2: 'Общий' }[value] || value)
                    },
                    {
                        key: 'from',
                        title: 'Откуда',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: stations,
                            relationMemberName: 'fromId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.name
                    },
                    {
                        key: 'to',
                        title: 'Куда',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: stations,
                            relationMemberName: 'toId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.name
                    },
                    {
                        key: 'route',
                        title: 'Маршрут',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: routes,
                            relationMemberName: 'routeId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.name
                    },
                    {
                        key: 'plan',
                        title: 'План вагонов',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: trainWagonsPlans,
                            relationMemberName: 'planId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.name
                    },
                    {
                        key: 'category',
                        title: 'Категория',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: trainCategories,
                            relationMemberName: 'categoryId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.name
                    },
                {
                    key: 'periodicity',
                    title: 'Периодичность',
                    isSortable: true,
                    editable: true,
                    type: viewTypeIds.select,
                    options: {
                        items: periodicities,
                        relationMemberName: 'periodicityId',
                        primitive: false,
                        props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
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
                        title: 'Название',
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
            <TrainSubmit resource={trainsResource} show={createShow} setShow={setCreateShow} resourceName={resourceActionPostfix} resourceMode="create" resourceData={newRow} onResourceSubmitted={async () => {
                fetch();
            }} orientation="horizontal" type="expandable"/>
            <TrainSubmit resource={trainsResource} show={editShow} setShow={setEditShow} resourceName={resourceActionPostfix} resourceMode="edit" resourceData={row} onResourceSubmitted={async () => {
                fetch();
            }} orientation="horizontal" type="expandable"/>
            <TrainDetails resource={trainsResource} show={detailsShow} setShow={setDetailsShow} resourceName={resourceActionPostfix} resourceData={row} orientation="horizontal" type="expandable"/>
        </>
    )
}
