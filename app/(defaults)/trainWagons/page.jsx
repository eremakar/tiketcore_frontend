'use client';

import ResourceTable from "@/components/genA/resourceTable";
import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useEffect, useState, useMemo } from "react";
import TrainScheduleLookup from "@/app/(defaults)/trainSchedules/lookup";
import WagonLookup from "@/app/(defaults)/wagons/lookup";
import { formatDate } from "@/components/genA/functions/datetime";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";
import IconRefresh from "@/components/icon/icon-refresh";
import IconPlus from "@/components/icon/icon-plus";
import IconMinus from "@/components/icon/icon-minus";
import SeatSegments from "@/app/(defaults)/seatSegments/page";

export default function TrainWagons({ defaultQuery = null, fullHeight = false, onDataChange = null, hideFilters = false, ...props }) {
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

    const [data, setData] = useState(null);
    const [row, setRow] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [currentExpandedWagonId, setCurrentExpandedWagonId] = useState(null);
    const resourceActionPostfix = "вагон состава поезда";

    // Memoize seat segments query to prevent unnecessary re-renders
    const seatSegmentsQuery = useMemo(() => {
        if (!currentExpandedWagonId) return null;
        return {
            paging: { skip: 0, take: 50 },
            filter: {
                wagonId: {
                    operand1: currentExpandedWagonId,
                    operator: 'equals'
                }
            },
            sort: {
                seatId: { operator: 'asc' }
            }
        };
    }, [currentExpandedWagonId]);

    const fetch = () => {
        setQuery({...query});
    }

    const trainSchedulesResource = useResource('trainSchedules');
    const wagonsResource = useResource('wagons');
    const trainWagonsResource = useResource('trainWagons');
    const [trainSchedules, setTrainSchedules] = useState([]);
    const [wagons, setWagons] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [tsRes, wRes] = await Promise.all([
                    trainSchedulesResource.search({ paging: { skip: 0 } }),
                    wagonsResource.search({ paging: { skip: 0 } })
                ]);
                setTrainSchedules(tsRes?.result || []);
                setWagons(wRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update query when defaultQuery changes
    useEffect(() => {
        if (defaultQuery) {
            setQuery(defaultQuery);
        }
    }, [defaultQuery]);

    // Check if trainScheduleId is filtered in query
    const isTrainScheduleFiltered = query?.filter?.trainScheduleId || defaultQuery?.filter?.trainScheduleId;

    const handleGenerateSeats = async (wrappedRow) => {
        try {
            const row = wrappedRow?.row || wrappedRow;
            const trainWagonId = row.id || row.key;
            if (!trainWagonId) {
                console.error('Train Wagon ID is undefined');
                return;
            }

            // POST request to generate seats
            await trainWagonsResource.post(`/${trainWagonId}/seats/generate`);

            // Refresh data
            fetch();
        } catch (error) {
            console.error('Error generating seats:', error);
        }
    };

    const toggleRowExpansion = (rowId) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(rowId)) {
            newExpandedRows.delete(rowId);
            setCurrentExpandedWagonId(null);
        } else {
            newExpandedRows.add(rowId);
            setCurrentExpandedWagonId(rowId);
        }
        setExpandedRows(newExpandedRows);
    };

    const renderSeats = (seats) => {
        if (!seats || !Array.isArray(seats) || seats.length === 0) {
            return <span className="text-gray-400">Нет мест</span>;
        }

        // Sort seats by number
        const sortedSeats = [...seats].sort((a, b) => (a.number || 0) - (b.number || 0));

        return (
            <div className="flex flex-wrap gap-1 max-w-xs">
                {sortedSeats.map((seat, index) => (
                    <div
                        key={index}
                        className="w-6 h-6 bg-blue-100 border border-blue-300 rounded text-xs flex items-center justify-center font-medium"
                        title={`Место ${seat.number || index + 1}`}
                    >
                        {seat.number || index + 1}
                    </div>
                ))}
            </div>
        );
    };
    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('trainWagons')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode={hideFilters ? "none" : "default"}
                sortMode={hideFilters ? "none" : "default"}
                leftActions={true}
                enableCellEditOnDoubleClick={false}
                fullHeight={fullHeight}
                renderExpandedRow={(wrappedRow) => {
                    const rowId = wrappedRow?.row?.id || wrappedRow?.id;
                    if (expandedRows.has(rowId) && seatSegmentsQuery) {
                        return <SeatSegments
                            defaultQuery={seatSegmentsQuery}
                            hideFilters={true}
                            fullHeight={false}
                        />;
                    }
                    return null;
                }}
                onChange={async (e) => {
                    // Notify parent component about data changes only when saving
                    switch (e.type) {
                        case dataTableEventTypeIds.newRow:
                            debugger;
                            const row = e.target.row;
                            const trainScheduleId = query?.filter?.trainScheduleId?.operand1;
                            row.trainScheduleId = trainScheduleId;
                            break;
                    }
                    if (e.type === dataTableEventTypeIds.commitRow && onDataChange) {
                        onDataChange();
                    }
                }}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                    ...(isTrainScheduleFiltered ? [] : [{
                        key: 'trainSchedule',
                        title: 'Расписание',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: trainSchedules,
                            relationMemberName: 'trainSchedule',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => [formatDate(value?.date), value?.train?.name].filter(Boolean).join(' ')
                    }]),
                    {
                        key: 'number',
                        title: 'Номер',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.text
                    },
                    {
                        key: 'wagon',
                        title: 'Wagon',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: wagons,
                            relationMemberName: 'wagonId',
                            props: { mode: 'portal', labelMemberFunc: (item) => item.type?.shortName || '', valueMemberName: 'id' }
                        },
                        render: (value) => value ? `${value.type?.shortName || ''} - ${value.seatCount || ''}` : ''
                    },
                    {
                        key: 'seats',
                        title: 'Места',
                        isSortable: false,
                        render: (value, row) => (
                            <div className="flex items-center gap-2">
                                {renderSeats(value)}
                                <button
                                    onClick={() => handleGenerateSeats(row)}
                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                    title="Сгенерировать места"
                                >
                                    <IconRefresh size={16} />
                                </button>
                            </div>
                        )
                    },
                    {
                        key: 'segments',
                        title: 'Сегменты',
                        isSortable: false,
                        style: { width: '100px' },
                        render: (value, row) => {
                            const rowId = row?.row?.id || row?.id;
                            const isExpanded = expandedRows.has(rowId);
                            return (
                                <button
                                    onClick={() => toggleRowExpansion(rowId)}
                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex items-center gap-1"
                                    title={isExpanded ? "Скрыть сегменты" : "Показать сегменты"}
                                >
                                    {isExpanded ? <IconMinus size={16} /> : <IconPlus size={16} />}
                                    <span className="text-sm">Показать</span>
                                </button>
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
                        title: 'Number',
                        key: 'number',
                        operator: 'like',
                    },
                    {
                        title: 'TrainScheduleId',
                        key: 'trainScheduleId',
                        renderField: (fieldProps) => <TrainScheduleLookup resource={trainSchedulesResource} {...fieldProps} />,
                    },
                    {
                        title: 'WagonId',
                        key: 'wagonId',
                        renderField: (fieldProps) => <WagonLookup resource={wagonsResource} {...fieldProps} />,
                    },
                ]}
                {...props}
            />
        </>
    )
}
