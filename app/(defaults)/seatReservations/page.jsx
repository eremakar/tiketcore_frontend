'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/components/genA/functions/datetime";
import RouteStationLookup from "@/app/(defaults)/routeStations/lookup";
import TrainLookup from "@/app/(defaults)/trains/lookup";
import TrainWagonLookup from "@/app/(defaults)/trainWagons/lookup";
import SeatLookup from "@/app/(defaults)/seats/lookup";
import TrainScheduleLookup from "@/app/(defaults)/trainSchedules/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import SeatReservationSubmit from "./submit";
import SeatReservationDetails from "./details";

export default function SeatReservations() {
    const [query, setQuery] = useState({
        paging: { skip: 0, take: 10 },
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
    const resourceActionPostfix = "бронирование места";

    const [routeStations, setRouteStations] = useState([]);
    const [trains, setTrains] = useState([]);
    const [trainWagons, setTrainWagons] = useState([]);
    const [seats, setSeats] = useState([]);
    const [trainSchedules, setTrainSchedules] = useState([]);

    const seatReservationsResource = useResource('seatReservations');
    const routeStationsResource = useResource('routeStations');
    const trainsResource = useResource('trains');
    const trainWagonsResource = useResource('trainWagons');
    const seatsResource = useResource('seats');
    const trainSchedulesResource = useResource('trainSchedules');

    useEffect(() => {
        const loadRefs = async () => {
            try {
                const [rsRes, trRes, twRes, sRes, tsRes] = await Promise.all([
                    routeStationsResource.search({ paging: { skip: 0 } }),
                    trainsResource.search({ paging: { skip: 0 } }),
                    trainWagonsResource.search({ paging: { skip: 0 } }),
                    seatsResource.search({ paging: { skip: 0 } }),
                    trainSchedulesResource.search({ paging: { skip: 0 } })
                ]);
                setRouteStations(rsRes?.result || []);
                setTrains(trRes?.result || []);
                setTrainWagons(twRes?.result || []);
                setSeats(sRes?.result || []);
                setTrainSchedules(tsRes?.result || []);
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
                useResource={() => useResource('seatReservations')}
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
                    { key: 'number', title: 'Номер', isSortable: true, editable: true, type: viewTypeIds.text },
                    {
                        key: 'train',
                        title: 'Поезд',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: trains,
                            relationMemberName: 'trainId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.name
                    },
                    { key: 'date', title: 'Дата', isSortable: true, editable: true, type: viewTypeIds.dateTime, render: (value) => formatDateTime(value) },
                    {
                        key: 'from',
                        title: 'Откуда',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: routeStations,
                            relationMemberName: 'fromId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.station?.name
                    },
                    {
                        key: 'to',
                        title: 'Куда',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: routeStations,
                            relationMemberName: 'toId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.station?.name
                    },
                    { key: 'price', title: 'Цена', isSortable: true, editable: true, type: viewTypeIds.float },
                    { key: 'total', title: 'Итого', isSortable: true, editable: true, type: viewTypeIds.float },
                    {
                        key: 'wagon',
                        title: 'Вагон',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: trainWagons,
                            relationMemberName: 'wagonId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.number
                    },
                    {
                        key: 'seat',
                        title: 'Место',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: seats,
                            relationMemberName: 'seatId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id', isNullable: true, isNullLabel: 'Не указано' }
                        },
                        render: (value) => value?.number
                    },
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
                    },
                    {
                        title: 'Номер',
                        key: 'number',
                        operator: 'like',
                    },
                    {
                        title: 'Дата',
                        key: 'date',
                        type: 'datetime',
                    },
                    {
                        title: 'Цена',
                        key: 'price',
                        type: 'number',
                    },
                    {
                        title: 'Итого',
                        key: 'total',
                        operator: 'like',
                    },
                    {
                        title: 'Откуда',
                        key: 'fromId',
                        renderField: (fieldProps) => <RouteStationLookup resource={routeStationsResource} {...fieldProps} />,
                    },
                    {
                        title: 'Куда',
                        key: 'toId',
                        renderField: (fieldProps) => <RouteStationLookup resource={routeStationsResource} {...fieldProps} />,
                    },
                    {
                        title: 'Поезд',
                        key: 'trainId',
                        renderField: (fieldProps) => <TrainLookup resource={trainsResource} {...fieldProps} />,
                    },
                    {
                        title: 'Вагон',
                        key: 'wagonId',
                        renderField: (fieldProps) => <TrainWagonLookup resource={trainWagonsResource} {...fieldProps} />,
                    },
                    {
                        title: 'Место',
                        key: 'seatId',
                        renderField: (fieldProps) => <SeatLookup resource={seatsResource} {...fieldProps} />,
                    },
                    {
                        title: 'Расписание',
                        key: 'trainScheduleId',
                        renderField: (fieldProps) => <TrainScheduleLookup resource={trainSchedulesResource} {...fieldProps} />,
                    },
                ]}
            />
            <SeatReservationSubmit 
                resource={seatReservationsResource} 
                show={createShow} 
                setShow={setCreateShow} 
                resourceName={resourceActionPostfix} 
                resourceMode="create" 
                resourceData={newRow} 
                onResourceSubmitted={async () => {
                    fetch();
                }} 
                orientation="horizontal" 
                type="expandable"
            />
            <SeatReservationSubmit 
                resource={seatReservationsResource} 
                show={editShow} 
                setShow={setEditShow} 
                resourceName={resourceActionPostfix} 
                resourceMode="edit" 
                resourceData={row} 
                onResourceSubmitted={async () => {
                    fetch();
                }} 
                orientation="horizontal" 
                type="expandable"
            />
            <SeatReservationDetails 
                resource={seatReservationsResource} 
                show={detailsShow} 
                setShow={setDetailsShow} 
                resourceName={resourceActionPostfix} 
                resourceData={row} 
                orientation="horizontal" 
                type="expandable"
            />
        </>
    )
}
