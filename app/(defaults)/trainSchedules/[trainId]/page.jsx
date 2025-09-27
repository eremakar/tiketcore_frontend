'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useEffect, useMemo, useState } from "react";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { formatDate } from "@/components/genA/functions/datetime";
import TrainWagons from "@/app/(defaults)/trainWagons/page";
import IconPower from "@/components/icon/icon-power";
import IconPowerOff from "@/components/icon/icon-power-off";
import IconWheel from "@/components/icon/icon-wheel";
import IconX from "@/components/icon/icon-x";
import Link from "next/link";

export default function TrainSchedulesDetails({ params }) {
    const trainId = useMemo(() => Number(params?.trainId), [params?.trainId]);

    const [selectedTrainScheduleId, setSelectedTrainScheduleId] = useState(null);
    const [selectedTrainSchedule, setSelectedTrainSchedule] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const [trainSchedulesQuery, setTrainSchedulesQuery] = useState({
        paging: { skip: 0, take: 10 },
        filter: trainId ? { trainId: { operand1: trainId, operator: 'equals' } } : {},
        sort: { id: { operator: 'desc' } }
    });

    const [trainWagonsQuery, setTrainWagonsQuery] = useState({
        paging: { skip: 0, take: 10 },
        filter: {},
        sort: { number: { operator: 'asc' } }
    });

    const [trainSchedulesData, setTrainSchedulesData] = useState(null);

    const [isWagonsDrawerOpen, setIsWagonsDrawerOpen] = useState(false);

    const trainSchedulesResource = useResource('trainSchedules');

    useEffect(() => {
        if (!trainId) return;
        setTrainSchedulesQuery((q) => ({
            ...q,
            filter: { trainId: { operand1: trainId, operator: 'equals' } }
        }));
    }, [trainId]);

    const handleTrainScheduleSelect = (e, wrappedRow) => {
        const id = wrappedRow?.row?.id || null;
        if (selectedTrainScheduleId === id) return;
        setSelectedTrainScheduleId(id);
        setSelectedTrainSchedule(wrappedRow?.row);

        if (id) {
            setTrainWagonsQuery({
                paging: { skip: 0, take: 10 },
                filter: { trainScheduleId: { operand1: id, operator: 'equals' } },
                sort: { number: { operator: 'asc' } }
            });
        } else {
            setTrainWagonsQuery({
                paging: { skip: 0, take: 10 },
                filter: {},
                sort: { number: { operator: 'asc' } }
            });
        }
    };

    const handleTrainWagonsChange = () => {
        setTimeout(() => {
            setTrainSchedulesQuery({ ...trainSchedulesQuery });
            setRefreshKey((prev) => prev + 1);
        }, 100);
    };

    const openWagonsDrawer = (wrappedRow) => {
        if (!wrappedRow) return;
        handleTrainScheduleSelect(null, wrappedRow);
        setIsWagonsDrawerOpen(true);
    };

    const handleToggleActive = async (wrappedRow) => {
        try {
            const row = wrappedRow?.row || wrappedRow;
            const newActiveStatus = !row.active;
            const rowId = row.id || row.key;
            if (!rowId) return;

            await trainSchedulesResource.patch(rowId, [
                { op: 'replace', path: '/active', value: newActiveStatus }
            ]);
            if (newActiveStatus) {
                await trainSchedulesResource.post(`/api/v1/trainSchedules/${rowId}/activate`);
            }
            setTrainSchedulesQuery({ ...trainSchedulesQuery });
        } catch (error) {
            console.error('Error toggling active status:', error);
        }
    };

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Расписания</h2>
                <Link className="btn btn-sm" href="/trainSchedules">Назад к поездам</Link>
            </div>
            <div className="border border-gray-300 rounded-md p-3 mb-4">
                <ResourceTable2
                    key={refreshKey}
                    data={trainSchedulesData}
                    setData={setTrainSchedulesData}
                    useResource={() => useResource('trainSchedules')}
                    resourceName="расписание поезда по дням"
                    query={trainSchedulesQuery}
                    setQuery={setTrainSchedulesQuery}
                    filterMode="default"
                    sortMode="default"
                    leftActions={true}
                    enableCellEditOnDoubleClick={false}
                    onRowClick={handleTrainScheduleSelect}
                    fullHeight={false}
                    selectedRowId={selectedTrainScheduleId}
                    columns={[
                        { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                        { key: 'date', title: 'Дата', isSortable: true, editable: true, type: viewTypeIds.date, render: (value) => formatDate(value) },
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
                                        className={`p-1 rounded transition-colors ${value ? 'text-red-500 hover:text-red-700 hover:bg-red-50' : 'text-green-500 hover:text-green-700 hover:bg-green-50'}`}
                                        title={value ? 'Деактивировать' : 'Активировать'}
                                    >
                                        {value ? <IconPowerOff size={16} /> : <IconPower size={16} />}
                                    </button>
                                </div>
                            )
                        },
                        {
                            key: 'wagons',
                            title: 'Вагоны',
                            isSortable: false,
                            type: viewTypeIds.control,
                            style: { width: '80px' },
                            render: (value, wrappedRow) => (
                                <button
                                    className="btn btn-sm prevent"
                                    onClick={(e) => { e.stopPropagation(); openWagonsDrawer(wrappedRow); }}
                                    title="Вагоны состава"
                                >
                                    <IconWheel />
                                </button>
                            )
                        }
                    ]}
                    filters={[
                        { title: 'Ид', key: 'id' },
                        { title: 'Дата', key: 'date', type: 'datetime' },
                        { title: 'Активен', key: 'active', type: 'boolean' },
                    ]}
                />
            </div>

            {/* Right Drawer for Train Wagons */}
            <div className={`fixed inset-0 z-50 ${isWagonsDrawerOpen ? '' : 'pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity ${isWagonsDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsWagonsDrawerOpen(false)}
                ></div>
                <div
                    className={`absolute right-0 top-0 h-full w-full max-w-[95vw] bg-white shadow-xl transform transition-transform ${isWagonsDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="text-md font-semibold">Вагоны состава</h3>
                        <button className="btn btn-sm prevent" onClick={() => setIsWagonsDrawerOpen(false)} title="Закрыть">
                            <IconX />
                        </button>
                    </div>
                    <div className="h-[calc(100%-52px)] overflow-auto p-3">
                        {!selectedTrainScheduleId && (
                            <p className="text-gray-500 text-sm">Выберите расписание для просмотра вагонов</p>
                        )}
                        {selectedTrainScheduleId && (
                            <div className="train-wagons-container w-full">
                                <TrainWagons
                                    defaultQuery={trainWagonsQuery}
                                    fullHeight={true}
                                    onDataChange={handleTrainWagonsChange}
                                    hideFilters={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


