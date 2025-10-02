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
    const [segmentPairs, setSegmentPairs] = useState([]);

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

    // Обертка onMap: строим группы и сразу формируем пары по первому элементу groups
    const mapAndBuildPairs = (segments) => {
        const grouped = groupSegments(segments);
        if (!grouped || grouped.length === 0) {
            setSegmentPairs([]);
            return grouped;
        }

        const firstGroup = grouped[0];
        const firstSegments = firstGroup?.segments || [];
        const seen = new Set();
        const pairs = [];

        firstSegments.forEach((segment) => {
            const fromId = segment?.from?.id || segment?.fromId;
            const toId = segment?.to?.id || segment?.toId;
            if (!fromId || !toId) return;
            const key = `${fromId}_${toId}`;
            if (seen.has(key)) return;
            seen.add(key);

            const fromName = segment?.from?.station?.name || segment?.from?.name || 'От';
            const toName = segment?.to?.station?.name || segment?.to?.name || 'До';
            pairs.push({ key, fromId, toId, title: `${fromName} → ${toName}` });
        });

        setSegmentPairs(pairs);
        return grouped;
    };

    const renderPairCell = (row, pair) => {
        const segments = row?.segments || [];
        const seg = segments.find(s => {
            const fromId = s?.from?.id || s?.fromId;
            const toId = s?.to?.id || s?.toId;
            return fromId === pair.fromId && toId === pair.toId;
        });

        if (!seg) {
            return <span className="text-gray-300">—</span>;
        }

        const hasReservation = seg.seatReservation?.id || seg.seatReservation;
        const hasTicket = seg.ticket?.id || seg.ticket;
        
        let bgColor = 'bg-blue-100 border-blue-300'; // по умолчанию синий (свободно)
        if (hasReservation) {
            bgColor = 'bg-orange-100 border-orange-300'; // оранжевый для брони
        } else if (hasTicket) {
            bgColor = 'bg-green-100 border-green-300'; // зеленый для билета
        }
        const title = `${seg.from?.station?.name || seg.from?.name || 'От'} → ${seg.to?.station?.name || seg.to?.name || 'До'}\nЦена: ${seg.price || 0} ₽\nБилет: ${seg.ticket?.name || seg.ticket?.id || '-'}\nРезерв: ${seg.seatReservation?.name || seg.seatReservation?.id || '-'}`;

        return (
            <div
                className={`${bgColor} border rounded text-xs font-medium text-center min-w-0 flex-shrink-0`}
                title={title}
            >
                {seg.price ?? ''}
            </div>
        );
    };

    // Функция для группировки сегментов по брони и создания объединенных ячеек
    const groupSegmentsByReservation = (segments) => {
        if (!segments || segments.length === 0) return [];
        
        const groups = {};
        segments.forEach(segment => {
            const reservationId = segment.seatReservation?.id || segment.seatReservation || 'no-reservation';
            if (!groups[reservationId]) {
                groups[reservationId] = {
                    reservationId,
                    segments: [],
                    totalPrice: 0
                };
            }
            groups[reservationId].segments.push(segment);
            groups[reservationId].totalPrice += segment.price || 0;
        });

        return Object.values(groups);
    };

    // Функция для группировки сегментов по билетам и создания объединенных ячеек
    const groupSegmentsByTicket = (segments) => {
        if (!segments || segments.length === 0) return [];
        
        const groups = {};
        segments.forEach(segment => {
            const ticketId = segment.ticket?.id || segment.ticket || 'no-ticket';
            if (!groups[ticketId]) {
                groups[ticketId] = {
                    ticketId,
                    segments: [],
                    totalPrice: 0
                };
            }
            groups[ticketId].segments.push(segment);
            groups[ticketId].totalPrice += segment.price || 0;
        });

        return Object.values(groups);
    };

    // Кастомный рендер строки с объединенными ячейками
    const renderRowWithMergedCells = (row, columns) => {
        const segments = row?.segments || [];
        const reservationGroups = groupSegmentsByReservation(segments);
        const ticketGroups = groupSegmentsByTicket(segments);
        
        return (
            <tr key={row.key}>
                {columns.map((column, columnIndex) => {
                    if (column.key.startsWith('seg_')) {
                        // Для сегментных колонок
                        const pairKey = column.key.replace('seg_', '');
                        const pair = segmentPairs.find(p => p.key === pairKey);
                        
                        if (!pair) {
                            return <td key={columnIndex} style={{ padding: '2px' }}>—</td>;
                        }

                        const seg = segments.find(s => {
                            const fromId = s?.from?.id || s?.fromId;
                            const toId = s?.to?.id || s?.toId;
                            return fromId === pair.fromId && toId === pair.toId;
                        });

                        if (!seg) {
                            return <td key={columnIndex} style={{ padding: '2px' }}>—</td>;
                        }

                        const reservationId = seg.seatReservation?.id || seg.seatReservation || 'no-reservation';
                        const ticketId = seg.ticket?.id || seg.ticket || 'no-ticket';
                        
                        // Проверяем бронь
                        const reservationGroup = reservationGroups.find(g => g.reservationId === reservationId);
                        const isReservationMerged = reservationGroup && reservationGroup.segments.length > 1 && reservationId !== 'no-reservation';
                        
                        // Проверяем билет
                        const ticketGroup = ticketGroups.find(g => g.ticketId === ticketId);
                        const isTicketMerged = ticketGroup && ticketGroup.segments.length > 1 && ticketId !== 'no-ticket';
                        
                        // Приоритет: сначала бронь, потом билет
                        if (isReservationMerged) {
                            // Находим индекс первого сегмента этой группы в списке пар
                            const firstSegmentInGroup = reservationGroup.segments[0];
                            const firstPairIndex = segmentPairs.findIndex(p => {
                                const fromId = firstSegmentInGroup?.from?.id || firstSegmentInGroup?.fromId;
                                const toId = firstSegmentInGroup?.to?.id || firstSegmentInGroup?.toId;
                                return p.fromId === fromId && p.toId === toId;
                            });
                            
                            const currentPairIndex = segmentPairs.findIndex(p => p.key === pairKey);
                            
                            // Если это не первый сегмент в группе, скрываем ячейку
                            if (currentPairIndex !== firstPairIndex) {
                                return null;
                            }
                            
                            // Рендерим объединенную ячейку для брони
                            const bgColor = 'bg-orange-100 border-orange-300';
                            const title = `Объединенная бронь\nКоличество сегментов: ${reservationGroup.segments.length}\nОбщая цена: ${reservationGroup.totalPrice} ₽`;
                            
                            return (
                                <td 
                                    key={columnIndex} 
                                    colSpan={reservationGroup.segments.length} 
                                    style={{ padding: '2px' }}
                                >
                                    <div
                                        className={`${bgColor} border rounded text-xs font-medium text-center min-w-0 flex-shrink-0`}
                                        title={title}
                                    >
                                        {reservationGroup.totalPrice} ({reservationGroup.segments.length})
                                    </div>
                                </td>
                            );
                        } else if (isTicketMerged) {
                            // Находим индекс первого сегмента этой группы в списке пар
                            const firstSegmentInGroup = ticketGroup.segments[0];
                            const firstPairIndex = segmentPairs.findIndex(p => {
                                const fromId = firstSegmentInGroup?.from?.id || firstSegmentInGroup?.fromId;
                                const toId = firstSegmentInGroup?.to?.id || firstSegmentInGroup?.toId;
                                return p.fromId === fromId && p.toId === toId;
                            });
                            
                            const currentPairIndex = segmentPairs.findIndex(p => p.key === pairKey);
                            
                            // Если это не первый сегмент в группе, скрываем ячейку
                            if (currentPairIndex !== firstPairIndex) {
                                return null;
                            }
                            
                            // Рендерим объединенную ячейку для билета
                            const bgColor = 'bg-green-100 border-green-300';
                            const title = `Объединенный билет\nКоличество сегментов: ${ticketGroup.segments.length}\nОбщая цена: ${ticketGroup.totalPrice} ₽`;
                            
                            return (
                                <td 
                                    key={columnIndex} 
                                    colSpan={ticketGroup.segments.length} 
                                    style={{ padding: '2px' }}
                                >
                                    <div
                                        className={`${bgColor} border rounded text-xs font-medium text-center min-w-0 flex-shrink-0`}
                                        title={title}
                                    >
                                        {ticketGroup.totalPrice} ({ticketGroup.segments.length})
                                    </div>
                                </td>
                            );
                        } else {
                            // Обычная ячейка
                            return (
                                <td key={columnIndex} style={{ padding: '2px' }}>
                                    {renderPairCell(row, pair)}
                                </td>
                            );
                        }
                    } else {
                        // Для обычных колонок
                        const value = row[column.key];
                        return (
                            <td key={columnIndex} style={{ padding: '2px' }}>
                                {column.render ? column.render(value, row) : value}
                            </td>
                        );
                    }
                })}
            </tr>
        );
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
                onMap={mapAndBuildPairs}
                filterMode={hideFilters ? "none" : "default"}
                sortMode={hideFilters ? "none" : "default"}
                hideDelete={true}
                fullHeight={fullHeight}
                renderRows={(columns, renderCell, data, page, renderActions) => 
                    page.map((row, rowIndex) => renderRowWithMergedCells(row, columns))
                }
                columns={(() => {
                    const base = [
                        { key: 'id', title: 'Ид', isSortable: true },
                        ...(isWagonFiltered ? [] : [
                            { key: 'trainSchedule', title: 'Расписание', isSortable: true, render: (value) => value?.name },
                            { key: 'train', title: 'Поезд', isSortable: true, render: (value) => value?.name },
                            { key: 'wagon', title: 'Вагон', isSortable: true, render: (value) => value?.number }
                        ]),
                        { key: 'seat', title: 'Место', isSortable: true, render: (value) => value?.number },
                    ];

                    if (segmentPairs.length > 0) {
                        const dyn = segmentPairs.map(pair => ({
                            key: `seg_${pair.key}`,
                            title: pair.title,
                            isSortable: false,
                            style: { padding: '2px' },
                            renderHead: () => (
                                <div className="text-center leading-tight">
                                    {pair.title.split(' → ').map((part, index) => (
                                        <div key={index} className="text-xs">{part}</div>
                                    ))}
                                </div>
                            ),
                            render: (value, row) => renderPairCell(row, pair)
                        }));
                        return [...base, ...dyn];
                    }

                    return [...base, {
                        key: 'segments',
                        title: 'Сегменты',
                        isSortable: false,
                        style: { padding: '2px' },
                        render: (value, row) => {
                            const segments = row.segments || [];

                            if (segments.length === 0) {
                                return <span className="text-gray-400">Нет сегментов</span>;
                            }

                            return (
                                <div className="flex flex-wrap gap-1 max-w-md">
                                    {segments.map((segment, index) => {
                                        const hasReservation = segment.seatReservation?.id || segment.seatReservation;
                                        const hasTicket = segment.ticket?.id || segment.ticket;
                                        
                                        let bgColor = 'bg-blue-100 border-blue-300'; // по умолчанию синий (свободно)
                                        if (hasReservation) {
                                            bgColor = 'bg-orange-100 border-orange-300'; // оранжевый для брони
                                        } else if (hasTicket) {
                                            bgColor = 'bg-green-100 border-green-300'; // зеленый для билета
                                        }

                                        return (
                                            <div
                                                key={segment.id || index}
                                                className={`${bgColor} border rounded text-xs font-medium min-w-0 flex-shrink-0`}
                                                title={`${segment.from?.station?.name || segment.from?.name || 'От'} → ${segment.to?.station?.name || segment.to?.name || 'До'}\nЦена: ${segment.price || 0} ₽\nБилет: ${segment.ticket?.name || segment.ticket?.id || '-'}\nРезерв: ${segment.seatReservation?.name || segment.seatReservation?.id || '-'}`}
                                            >
                                                {(segment.from?.station?.name || segment.from?.name || 'От').substring(0, 3)} → {(segment.to?.station?.name || segment.to?.name || 'До').substring(0, 3)}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }
                    }];
                })()}
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
