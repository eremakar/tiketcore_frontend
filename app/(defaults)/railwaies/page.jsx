'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import ResourceGrid from "@/components/genA/resourceGrid";
import useResource from "@/hooks/useResource";
import { useEffect, useState } from "react";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import RailwayStations from "@/app/(defaults)/railwayStations/page";

export default function Railwaies() {
    const [selectedRailwayId, setSelectedRailwayId] = useState(null);
    const [selectedRailway, setSelectedRailway] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [railwayStationsQuery, setRailwayStationsQuery] = useState({
        paging: { skip: 0, take: 10 },
        filter: {},
        sort: {
            name: { operator: 'asc' }
        }
    });

    // Railwaies query
    const [railwaiesQuery, setRailwaiesQuery] = useState({
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

    const [railwaiesData, setRailwaiesData] = useState(null);
    const [row, setRow] = useState(null);
    const resourceActionPostfix = "жД дорога";

    const fetch = () => {
        setRailwaiesQuery({...railwaiesQuery});
    }

    const stationsResource = useResource('stations');
    const [stations, setStations] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const stRes = await stationsResource.search({ paging: { skip: 0 }, sort: { code: { operator: 'asc' } } });
                setStations(stRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleRailwaySelect = (e, wrappedRow) => {
        const railwayId = wrappedRow?.row?.id || null;

        // Don't update if the same railway is selected
        if (selectedRailwayId === railwayId) {
            return;
        }

        setSelectedRailwayId(railwayId);
        setSelectedRailway(wrappedRow?.row);

        // Update railwayStationsQuery when railway is selected
        if (railwayId) {
            setRailwayStationsQuery({
                paging: { skip: 0, take: 10 },
                filter: {
                    railwayId: {
                        operand1: railwayId,
                        operator: 'equals'
                    }
                },
                sort: {
                    id: { operator: 'asc' }
                }
            });
        } else {
            setRailwayStationsQuery({
                paging: { skip: 0, take: 10 },
                filter: {},
                sort: {
                    id: { operator: 'asc' }
                }
            });
        }
    };

    const handleRailwayStationsChange = () => {
        // Refresh railways table when railway stations change with a small delay
        // to ensure the data has been updated on the server
        setTimeout(() => {
            setRailwaiesQuery({...railwaiesQuery});
            setRefreshKey(prev => prev + 1); // Force re-render
        }, 100);
    };

    const cells = [
        {
            content: (
                <div className="border-r border-gray-300 p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Железные дороги</h2>
                    <div className="flex-1">
                        <div className="">
                            <ResourceTable2
                                key={refreshKey}
                                data={railwaiesData}
                                setData={setRailwaiesData}
                                useResource={() => useResource('railwaies')}
                                resourceName={resourceActionPostfix}
                                query={railwaiesQuery}
                                setQuery={setRailwaiesQuery}
                                filterMode="default"
                                sortMode="default"
                                leftActions={true}
                                enableCellEditOnDoubleClick={false}
                                onRowClick={handleRailwaySelect}
                                fullHeight={true}
                                selectedRowId={selectedRailwayId}
                                columns={[
                                    { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                                    { key: 'name', title: 'Name', isSortable: true, editable: true, type: viewTypeIds.text },
                                    { key: 'code', title: 'Code', isSortable: true, editable: true, type: viewTypeIds.text },
                                    { key: 'shortCode', title: 'ShortCode', isSortable: true, editable: true, type: viewTypeIds.text },
                                    { key: 'timeDifferenceFromAdministration', title: 'TimeDifferenceFromAdministration', isSortable: true, editable: true, type: viewTypeIds.int, style: { minWidth: '140px' } },
                                    { key: 'type', title: 'Type', isSortable: true, editable: true, type: viewTypeIds.text },
                                ]}
                                filters={[
                                    {
                                        title: 'Ид',
                                        key: 'id',
                                    },
                                    {
                                        title: 'Name',
                                        key: 'name',
                                        operator: 'like',
                                    },
                                    {
                                        title: 'Code',
                                        key: 'code',
                                        operator: 'like',
                                    },
                                    {
                                        title: 'ShortCode',
                                        key: 'shortCode',
                                        operator: 'like',
                                    },
                                    {
                                        title: 'TimeDifferenceFromAdministration',
                                        key: 'timeDifferenceFromAdministration',
                                        type: 'number',
                                    },
                                    {
                                        title: 'Type',
                                        key: 'type',
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
                <div className="p-4 flex flex-col w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Станции железной дороги
                            {selectedRailway && (
                                <span className="text-sm text-gray-600 ml-2">
                                    ({selectedRailway.name || 'Без названия'})
                                </span>
                            )}
                        </h2>
                        {!selectedRailwayId && (
                            <p className="text-gray-500 text-sm">Выберите железную дорогу слева для просмотра станций</p>
                        )}
                    </div>

                    {selectedRailwayId && (
                        <div className="railway-stations-container flex-1 w-full">
                            <div className="">
                                <RailwayStations
                                    defaultQuery={railwayStationsQuery}
                                    fullHeight={true}
                                    onDataChange={handleRailwayStationsChange}
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
        <ResourceGrid
            cells={cells}
            defaultCellWidths={[40, 60]}
            minCellWidth={20}
            maxCellWidth={80}
            className="h-full"
        />
    )
}
