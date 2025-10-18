'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import ResourceGrid from "@/components/genA/resourceGrid";
import useResource from "@/hooks/useResource";
import { useState, useEffect, useCallback } from "react";
import TrainLookup from "@/app/(defaults)/trains/lookup";
import WagonLookup from "@/app/(defaults)/wagons/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import TrainWagonsPlanWagons from "@/app/(defaults)/trainWagonsPlanWagons/page";

export default function TrainWagonsPlans() {
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [trainWagonsPlanWagonsQuery, setTrainWagonsPlanWagonsQuery] = useState({
        paging: { skip: 0, take: 1000 },
        filter: {},
        sort: {
            number: { operator: 'asc' }
        }
    });

    // TrainWagonsPlans query
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
    const resourceActionPostfix = "план состава поезда";

    const fetch = () => {
        setQuery({...query});
    }

    const trainsResource = useResource('trains');
    const [trains, setTrains] = useState([]);

    // Load trains for dropdown
    useEffect(() => {
        const loadTrains = async () => {
            try {
                const trainsRes = await trainsResource.search({ paging: { skip: 0 } });
                setTrains(trainsRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        loadTrains();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePlanSelect = (e, wrappedRow) => {
        const planId = wrappedRow?.row?.id || null;

        // Don't update if the same plan is selected
        if (selectedPlanId === planId) {
            return;
        }

        setSelectedPlanId(planId);
        setSelectedPlan(wrappedRow?.row);

        // Update trainWagonsPlanWagonsQuery when plan is selected
        if (planId) {
            setTrainWagonsPlanWagonsQuery({
                paging: { skip: 0, take: 1000 },
                filter: {
                    planId: {
                        operand1: planId,
                        operator: 'equals'
                    }
                },
                sort: {
                    number: { operator: 'asc' }
                }
            });
        } else {
            setTrainWagonsPlanWagonsQuery({
                paging: { skip: 0, take: 1000 },
                filter: {},
                sort: {
                    number: { operator: 'asc' }
                }
            });
        }
    };

    const handleTrainWagonsPlanWagonsChange = useCallback(() => {
        // Refresh trainWagonsPlans table when trainWagonsPlanWagons change
        // setTimeout(() => {
        //     setQuery(prevQuery => ({...prevQuery}));
        //     setRefreshKey(prev => prev + 1);
        // }, 100);
    }, []);

    const cells = [
        {
            content: (
                <div className="border-r border-gray-300 p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Планы составов поездов</h2>
                    <div className="flex-1">
                        <div className="">
                            <ResourceTable2
                                key={refreshKey}
                                data={data}
                                setData={setData}
                                useResource={() => useResource('trainWagonsPlans')}
                                resourceName={resourceActionPostfix}
                                query={query}
                                setQuery={setQuery}
                                filterMode="default"
                                sortMode="default"
                                leftActions={true}
                                enableCellEditOnDoubleClick={false}
                                onRowClick={handlePlanSelect}
                                fullHeight={true}
                                selectedRowId={selectedPlanId}
                                columns={[
                                    { key: 'id', title: 'Ид', isSortable: true },
                                    { key: 'name', title: 'Название', isSortable: true, editable: true, type: viewTypeIds.text },
                                    {
                                        key: 'train',
                                        title: 'Поезд',
                                        isSortable: true,
                                        editable: true,
                                        type: viewTypeIds.select,
                                        options: {
                                            items: trains,
                                            relationMemberName: 'trainId',
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
                                        title: 'Название',
                                        key: 'name',
                                        operator: 'like',
                                    },
                                    {
                                        title: 'Поезд',
                                        key: 'trainId',
                                        renderField: (fieldProps) => <TrainLookup resource={trainsResource} {...fieldProps} />,
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
                <div className="p-4 flex flex-col w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Вагоны в плане состава
                            {selectedPlan && (
                                <span className="text-sm text-gray-600 ml-2">
                                    ({selectedPlan.name || 'Без названия'})
                                </span>
                            )}
                        </h2>
                        {!selectedPlanId && (
                            <p className="text-gray-500 text-sm">Выберите план состава слева для просмотра вагонов</p>
                        )}
                    </div>

                    {selectedPlanId && (
                        <div className="train-wagons-plan-wagons-container flex-1 w-full">
                            <div className="">
                                <TrainWagonsPlanWagons
                                    defaultQuery={trainWagonsPlanWagonsQuery}
                                    fullHeight={true}
                                    onDataChange={handleTrainWagonsPlanWagonsChange}
                                    isFilter={false}
                                    isSort={false}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <ResourceGrid
            cells={cells}
            defaultCellWidths={[40, 60]}
            minCellWidth={20}
            maxCellWidth={80}
            className="h-full"
        />
    )
}
