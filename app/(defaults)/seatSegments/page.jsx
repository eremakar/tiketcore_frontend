'use client';

import ResourceTable from "@/components/genA/resourceTable";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import SeatLookup from "@/app/(defaults)/seats/lookup";
import RouteStationLookup from "@/app/(defaults)/routeStations/lookup";
import TrainLookup from "@/app/(defaults)/trains/lookup";
import TrainWagonLookup from "@/app/(defaults)/trainWagons/lookup";
import TrainScheduleLookup from "@/app/(defaults)/trainSchedules/lookup";
import TicketLookup from "@/app/(defaults)/tickets/lookup";

export default function SeatSegments({ defaultQuery = null, hideFilters = false, fullHeight = false, ...props }) {
    const [query, setQuery] = useState(defaultQuery || {
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
    const [data, setData] = useState([]);

    const [row, setRow] = useState(null);
    const resourceActionPostfix = "сегмент по месту (от-до)";

    const fetch = () => {
        setQuery({...query});
    }

    // Update query when defaultQuery changes
    useEffect(() => {
        if (defaultQuery) {
            setQuery(defaultQuery);
        }
    }, [defaultQuery]);

    // Check if wagonId is filtered in query
    const isWagonFiltered = query?.filter?.wagonId || defaultQuery?.filter?.wagonId;

    const resource = useResource('seatSegments');
    const seatsResource = useResource('seats');
    const routeStationsResource = useResource('routeStations');
    const trainsResource = useResource('trains');
    const trainWagonsResource = useResource('trainWagons');
    const trainSchedulesResource = useResource('trainSchedules');
    const ticketsResource = useResource('tickets');

    // Функция группировки для onMap
    const groupSegments = (segments) => {
        if (!segments || !Array.isArray(segments)) return [];

        const groups = {};

        segments.forEach(segment => {
            const key = `${segment.trainSchedule?.id || 'null'}_${segment.wagon?.id || 'null'}_${segment.seat?.id || 'null'}`;

            if (!groups[key]) {
                groups[key] = {
                    id: key,
                    trainSchedule: segment.trainSchedule,
                    train: segment.train,
                    wagon: segment.wagon,
                    seat: segment.seat,
                    segments: []
                };
            }

            groups[key].segments.push(segment);
        });

        // Сортируем сегменты внутри каждой группы по id
        Object.values(groups).forEach(group => {
            group.segments.sort((a, b) => (a.id || 0) - (b.id || 0));
        });

        // Сортируем группы по номеру вагона и номеру места
        const sortedGroups = Object.values(groups).sort((a, b) => {
            const wagonA = a.wagon?.number || 0;
            const wagonB = b.wagon?.number || 0;

            if (wagonA !== wagonB) {
                return wagonA - wagonB;
            }

            const seatA = a.seat?.number || 0;
            const seatB = b.seat?.number || 0;
            return seatA - seatB;
        });

        return sortedGroups;
    };
    return (
        <>
            <ResourceTable
                resource={resource}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                data={data}
                setData={setData}
                onMap={groupSegments}
                filterMode={hideFilters ? "none" : "default"}
                sortMode={hideFilters ? "none" : "default"}
                hideDelete={true}
                fullHeight={fullHeight}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    ...(isWagonFiltered ? [] : [
                        { key: 'trainSchedule', title: 'Расписание', isSortable: true, render: (value) => value?.name },
                        { key: 'train', title: 'Поезд', isSortable: true, render: (value) => value?.name },
                        { key: 'wagon', title: 'Вагон', isSortable: true, render: (value) => value?.number }
                    ]),
                    { key: 'seat', title: 'Место', isSortable: true, render: (value) => value?.number },
                    {
                        key: 'segments',
                        title: 'Сегменты',
                        isSortable: false,
                        render: (value, row) => {
                            const segments = row.segments || [];

                            if (segments.length === 0) {
                                return <span className="text-gray-400">Нет сегментов</span>;
                            }

                            return (
                                <div className="flex flex-wrap gap-1 max-w-md">
                                    {segments.map((segment, index) => {
                                        const hasReservation = segment.seatReservation?.id || segment.seatReservation;
                                        const bgColor = hasReservation ? 'bg-orange-100 border-orange-300' : 'bg-blue-100 border-blue-300';

                                        return (
                                            <div
                                                key={segment.id || index}
                                                className={`px-2 py-1 ${bgColor} border rounded text-xs font-medium`}
                                                title={`${segment.from?.station?.name || segment.from?.name || 'От'} → ${segment.to?.station?.name || segment.to?.name || 'До'}\nЦена: ${segment.price || 0} ₽\nБилет: ${segment.ticket?.name || segment.ticket?.id || '-'}\nРезерв: ${segment.seatReservation?.name || segment.seatReservation?.id || '-'}`}
                                            >
                                                {(segment.from?.station?.name || segment.from?.name || 'От').substring(0, 3)} → {(segment.to?.station?.name || segment.to?.name || 'До').substring(0, 3)}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }
                    },
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
                    },
                    {
                        title: 'Price',
                        key: 'price',
                        type: 'number',
                    },
                    {
                        title: 'SeatId',
                        key: 'seatId',
                        renderField: (fieldProps) => <SeatLookup resource={seatsResource} {...fieldProps} />,
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
                    {
                        title: 'TicketId',
                        key: 'ticketId',
                        renderField: (fieldProps) => <TicketLookup resource={ticketsResource} {...fieldProps} />,
                    },
                    {
                        title: 'SeatReservationId',
                        key: 'seatReservationId',
                    },
                ]}
                {...props}
            />
        </>
    )
}
