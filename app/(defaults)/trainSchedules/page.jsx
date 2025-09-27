'use client';

import ResourceTable from "@/components/genA/resourceTable";
import ResourceTable2 from "@/components/genA/v2/resourceTable";
import ResourceGrid from "@/components/genA/resourceGrid";
import useResource from "@/hooks/useResource";
import { useEffect, useState } from "react";
import { formatDateTime, formatDateOnly, formatDate } from "@/components/genA/functions/datetime";
import TrainLookup from "@/app/(defaults)/trains/lookup";
import TrainWagons from "@/app/(defaults)/trainWagons/page";
import TrainScheduleSubmit from "@/app/(defaults)/trainSchedules/submit";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";
import IconPower from "@/components/icon/icon-power";
import IconPowerOff from "@/components/icon/icon-power-off";

export default function TrainSchedules() {
    const [selectedTrainId, setSelectedTrainId] = useState(null);
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [selectedTrainScheduleId, setSelectedTrainScheduleId] = useState(null);
    const [selectedTrainSchedule, setSelectedTrainSchedule] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [trainWagonsQuery, setTrainWagonsQuery] = useState({
        paging: { skip: 0, take: 10 },
        filter: {},
        sort: {
            number: { operator: 'asc' }
        }
    });

    // Trains query
    const [trainsQuery, setTrainsQuery] = useState({
        paging: { skip: 0, take: 10 },
        filter: {},
        sort: {
            id: {
                operator: 'desc'
            }
        }
    });

    // TrainSchedules query
    const [trainSchedulesQuery, setTrainSchedulesQuery] = useState({
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

    const [trainsData, setTrainsData] = useState(null);
    const [trainSchedulesData, setTrainSchedulesData] = useState(null);
    const [row, setRow] = useState(null);
    const resourceActionPostfix = "расписание поезда по дням";

    const fetchTrains = () => {
        setTrainsQuery({...trainsQuery});
    }

    const fetchTrainSchedules = () => {
        setTrainSchedulesQuery({...trainSchedulesQuery});
    }

    const trainsResource = useResource('trains');
    const trainSchedulesResource = useResource('trainSchedules');

    const handleTrainSelect = (e, wrappedRow) => {
        const trainId = wrappedRow?.row?.id || null;

        // Don't update if the same train is selected
        if (selectedTrainId === trainId) {
            return;
        }

        setSelectedTrainId(trainId);
        setSelectedTrain(wrappedRow?.row);
        setSelectedTrainScheduleId(null);
        setSelectedTrainSchedule(null);

        // Update trainSchedulesQuery when train is selected
        if (trainId) {
            setTrainSchedulesQuery({
                paging: { skip: 0, take: 10 },
                filter: {
                    trainId: {
                        operand1: trainId,
                        operator: 'equals'
                    }
                },
                sort: {
                    id: { operator: 'desc' }
                }
            });
        } else {
            setTrainSchedulesQuery({
                paging: { skip: 0, take: 10 },
                filter: {},
                sort: {
                    id: { operator: 'desc' }
                }
            });
        }

        // Clear train wagons
        setTrainWagonsQuery({
            paging: { skip: 0, take: 10 },
            filter: {},
            sort: {
                number: { operator: 'asc' }
            }
        });
    };

    const handleTrainScheduleSelect = (e, wrappedRow) => {
        const trainScheduleId = wrappedRow?.row?.id || null;

        // Don't update if the same train schedule is selected
        if (selectedTrainScheduleId === trainScheduleId) {
            return;
        }

        setSelectedTrainScheduleId(trainScheduleId);
        setSelectedTrainSchedule(wrappedRow?.row);

        // Update trainWagonsQuery when train schedule is selected
        if (trainScheduleId) {
            setTrainWagonsQuery({
                paging: { skip: 0, take: 10 },
                filter: {
                    trainScheduleId: {
                        operand1: trainScheduleId,
                        operator: 'equals'
                    }
                },
                sort: {
                    number: { operator: 'asc' }
                }
            });
        } else {
            setTrainWagonsQuery({
                paging: { skip: 0, take: 10 },
                filter: {},
                sort: {
                    number: { operator: 'asc' }
                }
            });
        }
    };

    const handleTrainWagonsChange = () => {
        // Refresh train schedules table when train wagons change with a small delay
        // to ensure the data has been updated on the server
        setTimeout(() => {
            fetchTrainSchedules();
            setRefreshKey(prev => prev + 1); // Force re-render
        }, 100);
    };

    const handleToggleActive = async (wrappedRow) => {
        try {
            const row = wrappedRow?.row || wrappedRow;
            const newActiveStatus = !row.active;
            const rowId = row.id || row.key;

            if (!rowId) {
                console.error('Row ID is undefined');
                return;
            }

            // PATCH request to update active status
            await trainSchedulesResource.patch(rowId, [
                { op: "replace", path: "/active", value: newActiveStatus }
            ]);

            // If activating, also make POST request to activate endpoint
            if (newActiveStatus) {
                await trainSchedulesResource.post(`/api/v1/trainSchedules/${rowId}/activate`);
            }

            // Refresh data
            fetchTrainSchedules();
        } catch (error) {
            console.error('Error toggling active status:', error);
        }
    };
    const cells = [
        {
            content: (
                <div className="border-r border-gray-300 p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Поезда</h2>
                    <div className="flex-1">
                        <div className="">
                            <ResourceTable2
                                data={trainsData}
                                setData={setTrainsData}
                                useResource={() => useResource('trains')}
                                resourceName="поезд"
                                query={trainsQuery}
                                setQuery={setTrainsQuery}
                                filterMode="default"
                                sortMode="default"
                                leftActions={true}
                                enableCellEditOnDoubleClick={false}
                                onRowClick={handleTrainSelect}
                                fullHeight={true}
                                selectedRowId={selectedTrainId}
                                columns={[
                                    { key: 'id', title: 'Ид', isSortable: true },
                                    { key: 'name', title: 'Название', isSortable: true, editable: true, type: viewTypeIds.text },
                                    { key: 'number', title: 'Номер', isSortable: true, editable: true, type: viewTypeIds.text },
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
                                        title: 'Номер',
                                        key: 'number',
                                        operator: 'like',
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            )
        },
        {
            content: (
                <div className="border-r border-gray-300 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Расписания
                            {selectedTrain && (
                                <span className="text-sm text-gray-600 ml-2">
                                    ({selectedTrain.name || 'Без названия'})
                                </span>
                            )}
                        </h2>
                        {selectedTrainId && (
                            <button
                                onClick={() => setCreateShow(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Создать расписание
                            </button>
                        )}
                    </div>
                    {!selectedTrainId && (
                        <p className="text-gray-500 text-sm">Выберите поезд слева для просмотра расписаний</p>
                    )}
                    <div className="flex-1">
                        {selectedTrainId && (
                            <div className="">
                                <ResourceTable2
                                    key={refreshKey}
                                    data={trainSchedulesData}
                                    setData={setTrainSchedulesData}
                                    useResource={() => useResource('trainSchedules')}
                                    resourceName={resourceActionPostfix}
                                    query={trainSchedulesQuery}
                                    setQuery={setTrainSchedulesQuery}
                                    filterMode="default"
                                    sortMode="default"
                                    leftActions={true}
                                    enableCellEditOnDoubleClick={false}
                                    onRowClick={handleTrainScheduleSelect}
                                    fullHeight={true}
                                    selectedRowId={selectedTrainScheduleId}
                                    columns={[
                                        { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                                        {
                                            key: 'date',
                                            title: 'Дата',
                                            isSortable: true,
                                            editable: true,
                                            type: viewTypeIds.date,
                                            render: (value) => formatDate(value)
                                        },
                                        {
                                            key: 'active',
                                            title: 'Активен',
                                            isSortable: true,
                                            editable: true,
                                            type: viewTypeIds.boolean,
                                            render: (value, row) => (
                                                <div className="flex items-center gap-2">
                                                    <span>{value ? 'Да' : 'Нет'}</span>
                                                    <button
                                                        onClick={() => handleToggleActive(row)}
                                                        className={`p-1 rounded transition-colors ${
                                                            value
                                                                ? 'text-red-500 hover:text-red-700 hover:bg-red-50'
                                                                : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                                                        }`}
                                                        title={value ? 'Деактивировать' : 'Активировать'}
                                                    >
                                                        {value ? <IconPowerOff size={16} /> : <IconPower size={16} />}
                                                    </button>
                                                </div>
                                            )
                                        },
                                    ]}
                                    filters={[
                                        {
                                            title: 'Ид',
                                            key: 'id',
                                        },
                                        {
                                            title: 'Дата',
                                            key: 'date',
                                            type: 'datetime',
                                        },
                                        {
                                            title: 'Активен',
                                            key: 'active',
                                            type: 'boolean',
                                        },
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            content: (
                <div className="p-4 flex flex-col w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Вагоны состава
                            {selectedTrainSchedule && (
                                <span className="text-sm text-gray-600 ml-2">
                                    ({selectedTrainSchedule.train?.name || 'Без номера'} - {formatDate(selectedTrainSchedule.date)})
                                </span>
                            )}
                        </h2>
                        {!selectedTrainScheduleId && (
                            <p className="text-gray-500 text-sm">Выберите расписание слева для просмотра вагонов</p>
                        )}
                    </div>

                    {selectedTrainScheduleId && (
                        <div className="train-wagons-container flex-1 w-full">
                            <div className="">
                                <TrainWagons
                                    defaultQuery={trainWagonsQuery}
                                    fullHeight={true}
                                    onDataChange={handleTrainWagonsChange}
                                    hideFilters={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <>
            <ResourceGrid
                cells={cells}
                defaultCellWidths={[30, 35, 35]}
                minCellWidth={20}
                maxCellWidth={80}
                className="h-full"
            />

            {createShow && (
                <TrainScheduleSubmit
                    show={createShow}
                    setShow={setCreateShow}
                    resource={trainSchedulesResource}
                    resourceName={resourceActionPostfix}
                    initialData={{ trainId: selectedTrainId }}
                    onResourceSubmitted={() => {
                        setCreateShow(false);
                        fetchTrainSchedules();
                    }}
                />
            )}
        </>
    )
}
