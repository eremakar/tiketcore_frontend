'use client';

import ResourceTable from "@/components/genA/resourceTable";
import useResource from "@/hooks/useResource";
import { useState } from "react";
import { formatDateTime } from "@/components/genA/functions/datetime";
import RouteStationLookup from "@/app/(defaults)/routeStations/lookup";
import TrainLookup from "@/app/(defaults)/trains/lookup";
import TrainWagonLookup from "@/app/(defaults)/trainWagons/lookup";
import SeatLookup from "@/app/(defaults)/seats/lookup";
import TrainScheduleLookup from "@/app/(defaults)/trainSchedules/lookup";

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

    const [row, setRow] = useState(null);
    const resourceActionPostfix = "бронирование места";

    const fetch = () => {
        setQuery({...query});
    }

    const resource = useResource('seatReservations');
    const routeStationsResource = useResource('routeStations');
    const trainsResource = useResource('trains');
    const trainWagonsResource = useResource('trainWagons');
    const seatsResource = useResource('seats');
    const trainSchedulesResource = useResource('trainSchedules');
    return (
        <>
            <ResourceTable
                resource={resource}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode="default"
                sortMode="default"
                hideDelete={false}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    { key: 'number', title: 'Number', isSortable: true },
                    { key: 'date', title: 'Date', isSortable: true, render: (value) => formatDateTime(value) },
                    { key: 'price', title: 'Price', isSortable: true },
                    { key: 'total', title: 'Total', isSortable: true },
                    { key: 'from', title: 'From', isSortable: true, render: (value) => value?.name },
                    { key: 'to', title: 'To', isSortable: true, render: (value) => value?.name },
                    { key: 'train', title: 'Train', isSortable: true, render: (value) => value?.name },
                    { key: 'wagon', title: 'Wagon', isSortable: true, render: (value) => value?.name },
                    { key: 'seat', title: 'Seat', isSortable: true, render: (value) => value?.name },
                    { key: 'trainSchedule', title: 'TrainSchedule', isSortable: true, render: (value) => value?.name },
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
                    },
                    {
                        title: 'Number',
                        key: 'number',
                        operator: 'like',
                    },
                    {
                        title: 'Date',
                        key: 'date',
                        type: 'datetime',
                    },
                    {
                        title: 'Price',
                        key: 'price',
                        type: 'number',
                    },
                    {
                        title: 'Total',
                        key: 'total',
                        operator: 'like',
                    },
                    {
                        title: 'FromId',
                        key: 'fromId',
                        renderField: (fieldProps) => <RouteStationLookup resource={routeStationsResource} {...fieldProps} />,
                    },
                    {
                        title: 'ToId',
                        key: 'toId',
                        renderField: (fieldProps) => <RouteStationLookup resource={routeStationsResource} {...fieldProps} />,
                    },
                    {
                        title: 'TrainId',
                        key: 'trainId',
                        renderField: (fieldProps) => <TrainLookup resource={trainsResource} {...fieldProps} />,
                    },
                    {
                        title: 'WagonId',
                        key: 'wagonId',
                        renderField: (fieldProps) => <TrainWagonLookup resource={trainWagonsResource} {...fieldProps} />,
                    },
                    {
                        title: 'SeatId',
                        key: 'seatId',
                        renderField: (fieldProps) => <SeatLookup resource={seatsResource} {...fieldProps} />,
                    },
                    {
                        title: 'TrainScheduleId',
                        key: 'trainScheduleId',
                        renderField: (fieldProps) => <TrainScheduleLookup resource={trainSchedulesResource} {...fieldProps} />,
                    },
                ]}
            />
        </>
    )
}
