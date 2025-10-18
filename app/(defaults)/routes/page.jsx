'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import ResourceGrid from "@/components/genA/resourceGrid";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import TrainLookup from "@/app/(defaults)/trains/lookup";
import { formatDateOnlyTime } from "@/components/genA/functions/datetime";
import RouteStations from "@/app/(defaults)/routeStations/page";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";

export default function Routes() {
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [routeStationsQuery, setRouteStationsQuery] = useState({
        paging: { skip: 0, take: 1000 },
        filter: {},
        sort: {
            order: { operator: 'asc' }
        }
    });

    // Routes query
    const [routesQuery, setRoutesQuery] = useState({
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

    const [routesData, setRoutesData] = useState(null);
    const [row, setRow] = useState(null);
    const resourceActionPostfix = "маршрут";

    const fetch = () => {
        setRoutesQuery({...routesQuery});
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

    const handleRouteSelect = (e, wrappedRow) => {
        const routeId = wrappedRow?.row?.id || null;

        // Don't update if the same route is selected
        if (selectedRouteId === routeId) {
            return;
        }

        setSelectedRouteId(routeId);
        setSelectedRoute(wrappedRow?.row);

        // Update routeStationsQuery when route is selected
        if (routeId) {
            setRouteStationsQuery({
                paging: { skip: 0, take: 1000 },
                filter: {
                    routeId: {
                        operand1: routeId,
                        operator: 'equals'
                    }
                },
                sort: {
                    order: { operator: 'asc' }
                }
            });
        } else {
            setRouteStationsQuery({
                paging: { skip: 0, take: 1000 },
                filter: {},
                sort: {
                    order: { operator: 'asc' }
                }
            });
        }
    };

    const handleRouteStationsChange = () => {
        // Refresh routes table when route stations change with a small delay
        // to ensure the data has been updated on the server
        setTimeout(() => {
            setRoutesQuery({...routesQuery});
            setRefreshKey(prev => prev + 1); // Force re-render
        }, 100);
    };


    const cells = [
        {
            content: (
                <div className="border-r border-gray-300 p-4 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Маршруты</h2>
                    <div className="flex-1">
                        <div className="">
                            <ResourceTable2
                                key={refreshKey}
                                data={routesData}
                                setData={setRoutesData}
                                useResource={() => useResource('routes')}
                                resourceName={resourceActionPostfix}
                                query={routesQuery}
                                setQuery={setRoutesQuery}
                                filterMode="default"
                                sortMode="default"
                                leftActions={true}
                                enableCellEditOnDoubleClick={false}
                                onRowClick={handleRouteSelect}
                                fullHeight={true}
                                selectedRowId={selectedRouteId}
                        columns={[
                            { key: 'id', title: 'Ид', isSortable: true },
                            { key: 'name', title: 'Название', isSortable: true, editable: true, type: viewTypeIds.text },
                            {
                                key: 'train',
                                title: 'Номер поезда',
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
                            // {
                            //     key: 'stations',
                            //     title: 'Станции',
                            //     isSortable: false,
                            //     render: (value) => {
                            //         if (!value || !Array.isArray(value)) return '-';
                            //         const sortedStations = value
                            //             .sort((a, b) => a.order - b.order)
                            //             .filter(station => station.station?.name);

                            //         if (sortedStations.length === 0) return '-';

                            //         return (
                            //             <div className="max-w-md">
                            //                 <table className="w-full text-xs border-collapse border border-gray-300">
                            //                     <thead>
                            //                         <tr className="bg-gray-100">
                            //                             <th className="border border-gray-300 px-2 py-1 text-left">Порядок</th>
                            //                             <th className="border border-gray-300 px-2 py-1 text-left">Станция</th>
                            //                             <th className="border border-gray-300 px-2 py-1 text-left">Прибытие</th>
                            //                             <th className="border border-gray-300 px-2 py-1 text-left">Остановка</th>
                            //                             <th className="border border-gray-300 px-2 py-1 text-left">Отправление</th>
                            //                         </tr>
                            //                     </thead>
                            //                     <tbody>
                            //                         {sortedStations.map((station, index) => (
                            //                             <tr key={index} className="hover:bg-gray-50">
                            //                                 <td className="border border-gray-300 px-2 py-1">{station.order}</td>
                            //                                 <td className="border border-gray-300 px-2 py-1">{station.station?.name}</td>
                            //                                 <td className="border border-gray-300 px-2 py-1">
                            //                                     {station.arrival ? formatDateOnlyTime(station.arrival) : '-'}
                            //                                 </td>
                            //                                 <td className="border border-gray-300 px-2 py-1">
                            //                                     {station.stop ? formatDateOnlyTime(station.stop) : '-'}
                            //                                 </td>
                            //                                 <td className="border border-gray-300 px-2 py-1">
                            //                                     {station.departure ? formatDateOnlyTime(station.departure) : '-'}
                            //                                 </td>
                            //                             </tr>
                            //                         ))}
                            //                     </tbody>
                            //                 </table>
                            //             </div>
                            //         );
                            //     }
                            // },
                        ]}
                        filters={[
                            {
                                title: 'Ид',
                                key: 'id',
                            },
                            {
                                title: 'Номер поезда',
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
                            Станции маршрута
                            {selectedRoute && (
                                <span className="text-sm text-gray-600 ml-2">
                                    ({selectedRoute.train?.name || 'Без номера'})
                                </span>
                            )}
                        </h2>
                        {!selectedRouteId && (
                            <p className="text-gray-500 text-sm">Выберите маршрут слева для просмотра станций</p>
                        )}
                    </div>

                    {selectedRouteId && (
                        <div className="route-stations-container flex-1 w-full">
                            <div className="">
                                <RouteStations
                                    defaultQuery={routeStationsQuery}
                                    fullHeight={true}
                                    onDataChange={handleRouteStationsChange}
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
