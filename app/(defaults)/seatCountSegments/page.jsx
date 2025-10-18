'use client';

import ResourceTable from "@/components/genA/resourceTable";
import useResource from "@/hooks/useResource";
import { useState } from "react";
import RouteStationLookup from "@/app/(defaults)/routeStations/lookup";
import TrainLookup from "@/app/(defaults)/trains/lookup";
import TrainWagonLookup from "@/app/(defaults)/trainWagons/lookup";
import TrainScheduleLookup from "@/app/(defaults)/trainSchedules/lookup";

export default function SeatCountSegments() {
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

    const [row, setRow] = useState(null);
    const resourceActionPostfix = "сегмент по количеству мест";

    const fetch = () => {
        setQuery({...query});
    }

    const map = (items) => {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.tickets) {
                item.tickets = asJSONSafe(item.tickets);
            }
        }

        return items;
    }

    const resource = useResource('seatCountSegments');
    const routeStationsResource = useResource('routeStations');
    const trainsResource = useResource('trains');
    const trainWagonsResource = useResource('trainWagons');
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
                onMap={map}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    { key: 'seatCount', title: 'SeatCount', isSortable: true },
                    { key: 'freeCount', title: 'FreeCount', isSortable: true },
                    { key: 'price', title: 'Price', isSortable: true },
                    { key: 'tickets', title: 'Tickets', isSortable: true },
                    { key: 'from', title: 'From', isSortable: true, render: (value) => value?.name },
                    { key: 'to', title: 'To', isSortable: true, render: (value) => value?.name },
                    { key: 'train', title: 'Train', isSortable: true, render: (value) => value?.name },
                    { key: 'wagon', title: 'Wagon', isSortable: true, render: (value) => value?.name },
                    { key: 'trainSchedule', title: 'TrainSchedule', isSortable: true, render: (value) => value?.name },
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
                    },
                    {
                        title: 'SeatCount',
                        key: 'seatCount',
                        type: 'number',
                    },
                    {
                        title: 'FreeCount',
                        key: 'freeCount',
                        type: 'number',
                    },
                    {
                        title: 'Price',
                        key: 'price',
                        type: 'number',
                    },
                    {
                        title: 'Tickets',
                        key: 'tickets',
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
                        title: 'TrainScheduleId',
                        key: 'trainScheduleId',
                        renderField: (fieldProps) => <TrainScheduleLookup resource={trainSchedulesResource} {...fieldProps} />,
                    },
                ]}
            />
        </>
    )
}
