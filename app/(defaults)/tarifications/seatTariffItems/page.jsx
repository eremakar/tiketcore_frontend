'use client';

import ResourceTable from "@/components/genA/resourceTable";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import WagonClassLookup from "@/app/(defaults)/tarifications/wagonClasses/lookup";
import SeasonLookup from "@/app/(defaults)/tarifications/seasons/lookup";
import SeatTypeLookup from "@/app/(defaults)/seatTypes/lookup";
import StationLookup from "@/app/(defaults)/stations/lookup";

export default function SeatTariffItems({ defaultQuery = null, fullHeight = false, hideFilters = false, ...props }) {
    const [query, setQuery] = useState(defaultQuery || {
        paging: { skip: 0, take: 1000 },
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
    const [calculationDialogShow, setCalculationDialogShow] = useState(false);
    const [calculationData, setCalculationData] = useState(null);

    const [row, setRow] = useState(null);
    const resourceActionPostfix = "элемент тарифа места";

    const [matrixData, setMatrixData] = useState([]);
    const [stations, setStations] = useState([]);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'matrix'

    // Check if seatTariffId is present in query
    const hasSeatTariffId = query?.filter?.seatTariffId?.operand1 || query?.filter?.seatTariffId;

    // Update query when defaultQuery changes
    useEffect(() => {
        if (defaultQuery) {
            setQuery(defaultQuery);
        }
    }, [defaultQuery]);

    // Auto-switch to matrix view if seatTariffId is present
    useEffect(() => {
        if (hasSeatTariffId) {
            setViewMode('matrix');
        }
    }, [hasSeatTariffId]);

    const fetch = () => {
        setQuery({...query});
    }

    const parseExpression = (expression) => {
        if (!expression) return null;

        try {
            // Парсим выражение вида: Price = distance:57 * baseFarePrice:3,725 * trainCategoryCoefficient:1,5 * wagonCoefficient:1,1 * seatTypeCoefficient:1,2 * wagonTypeCoefficient:1 * vat:12 = 5044,842000000001
            const match = expression.match(/Price = (.+) = (.+)/);
            if (!match) return null;

            const formula = match[1];
            const result = match[2];
            
            // Разбираем формулу на компоненты
            const components = formula.split(' * ').map(comp => {
                const [name, value] = comp.split(':');
                return {
                    name: name.trim(),
                    value: parseFloat(value.replace(',', '.'))
                };
            });

            // Создаем красивое объяснение
            const explanations = {
                'distance': 'Расстояние между станциями (км)',
                'baseFarePrice': 'Базовая стоимость за километр (₸)',
                'trainCategoryCoefficient': 'Коэффициент категории поезда',
                'wagonCoefficient': 'Коэффициент типа вагона',
                'seatTypeCoefficient': 'Коэффициент типа места',
                'wagonTypeCoefficient': 'Коэффициент типа вагона',
                'vat': 'Налог на добавленную стоимость (%)'
            };

            return {
                formula,
                result: parseFloat(result.replace(',', '.')),
                components: components.map(comp => ({
                    ...comp,
                    explanation: explanations[comp.name] || comp.name
                }))
            };
        } catch (error) {
            console.error('Error parsing expression:', error);
            return null;
        }
    };

    const handleCellClick = async (fromStation, toStation, group) => {
        const calculationParameters = group.calculationParameters ? JSON.parse(group.calculationParameters) : null;
        const expression = calculationParameters ? calculationParameters.expression : null;
        try {
            if (calculationParameters) {
                // Парсим выражение для красивого отображения
                const parsedExpression = parseExpression(expression);
                setCalculationData({
                    ...calculationParameters,
                    parsedExpression
                });
                setCalculationDialogShow(true);
            } else {
                console.log('No calculationParameters found for this item');
            }
        } catch (error) {
            console.error('Error loading calculation parameters:', error);
        }
    }

    const resource = useResource('seatTariffItems');
    const wagonClassesResource = useResource('wagonClasses');
    const seasonsResource = useResource('seasons');
    const seatTypesResource = useResource('seatTypes');
    const stationsResource = useResource('stations');
    const seatTariffsResource = useResource('seatTariffs');
    const trainsResource = useResource('trains');
    const routesResource = useResource('routes');
    const routeStationsResource = useResource('routeStations');

    // Load stations and build matrix
    useEffect(() => {
        const loadData = async () => {
            try {
                // Get seatTariffId from query filter
                const seatTariffId = query?.filter?.seatTariffId?.operand1 || query?.filter?.seatTariffId;
                
                if (!seatTariffId) {
                    setStations([]);
                    setMatrixData([]);
                    return;
                }
                
                // Step 1: Load seatTariff
                
                const seatTariff = await seatTariffsResource.get(seatTariffId);
                if (!seatTariff?.trainId) {
                    setStations([]);
                    setMatrixData([]);
                    return;
                }
                
                // Step 2: Load train
                const train = await trainsResource.get(seatTariff.trainId);
                if (!train?.routeId) {
                    setStations([]);
                    setMatrixData([]);
                    return;
                }
                
                // Step 3: Load route stations
                const routeStationsRes = await routeStationsResource.search({
                    paging: { skip: 0, take: 1000 },
                    filter: {
                        routeId: {
                            operand1: train.routeId,
                            operator: 'equals'
                        }
                    },
                    include: ['station'],
                    sort: {
                        order: { operator: 'asc' }
                    }
                });
                
                const routeStations = routeStationsRes?.result || [];
                const stationsList = routeStations
                    .filter(routeStation => routeStation.station)
                    .map(routeStation => ({
                        ...routeStation.station,
                        order: routeStation.order,
                        distance: routeStation.distance
                    }))
                    .sort((a, b) => a.order - b.order);
                
                setStations(stationsList);
                
                // Step 4: Load tariff items for this seatTariff
                const tariffItemsRes = await resource.search({ 
                    paging: { skip: 0, take: 1000 },
                    filter: {
                        seatTariffId: {
                            operand1: seatTariffId,
                            operator: 'equals'
                        }
                    },
                    include: ['from', 'to', 'wagon', 'season', 'seatType']
                });
                
                const tariffItems = tariffItemsRes?.result || [];
                
                // Build matrix data
                const matrix = stationsList.map(fromStation => {
                    const row = {
                        station: fromStation,
                        distance: fromStation.distance || 0,
                        ...stationsList.reduce((acc, toStation) => {
                            // Group tariff items by fromId and toId
                            const tariffItemsForRoute = tariffItems.filter(item => 
                                item.from?.id === fromStation.id && 
                                item.to?.id === toStation.id
                            );
                            
                            // Group by wagon and seatType
                            const groupedItems = tariffItemsForRoute.reduce((group, item) => {
                                const key = `${item.wagon?.name || 'Unknown'}_${item.seatType?.name || 'Unknown'}`;
                                if (!group[key]) {
                                    group[key] = {
                                        wagonName: item.wagon?.name,
                                        seatType: item.seatType?.name,
                                        calculationParameters: item.calculationParameters,
                                        prices: []
                                    };
                                }
                                group[key].prices.push({
                                    price: item.price,
                                    distance: item.distance,
                                    season: item.season?.name,
                                    calculationParameters: item.calculationParameters
                                });
                                return group;
                            }, {});
                            
                            acc[`to_${toStation.id}`] = Object.keys(groupedItems).length > 0 ? groupedItems : null;
                            return acc;
                        }, {})
                    };
                    return row;
                });
                
                setMatrixData(matrix);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        
        loadData();
    }, [query]);

    const renderMatrixTable = () => {
        if (!matrixData.length || !stations.length) {
            return <div className="p-4">Загрузка данных...</div>;
        }

        return (
            <div className="overflow-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Станция отправления</th>
                            <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Расстояние (км)</th>
                            {stations.slice(1).map(station => (
                                <th key={station.id} className="border border-gray-300 px-2 py-1 text-center font-semibold min-w-[200px]">
                                    {station.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrixData.map((row, index) => (
                            <tr key={row.station.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="border border-gray-300 px-2 py-1 font-medium">
                                    {row.station.name}
                                </td>
                                <td className="border border-gray-300 px-2 py-1 text-center">
                                    {row.distance || '-'}
                                </td>
                                {stations.slice(1).map(toStation => {
                                    const cellData = row[`to_${toStation.id}`];
                                    return (
                                        <td key={toStation.id} className="border border-gray-300 px-2 py-1 text-center">
                                            {cellData ? (
                                                <div className="space-y-1">
                                                    {Object.values(cellData)
                                                        .filter(group => group.wagonName && group.wagonName !== 'Unknown')
                                                        .map((group, groupIndex) => (
                                                        <div 
                                                            key={groupIndex} 
                                                            className="pb-1 cursor-pointer hover:bg-blue-50 rounded px-1"
                                                            onClick={() => handleCellClick(row.station, toStation, group)}
                                                        >
                                                            {group.prices.map((priceInfo, priceIndex) => (
                                                                <div key={priceIndex} className="text-xs">
                                                                    <span className="font-semibold text-gray-700">
                                                                        {group.wagonName}/{group.seatType}
                                                                    </span>
                                                                    <span className="ml-1 font-semibold text-blue-600">
                                                                        {Math.round(priceInfo.price)}₸
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Тарифы мест</h1>
                {!hasSeatTariffId && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 rounded ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Таблица
                        </button>
                        <button
                            onClick={() => setViewMode('matrix')}
                            className={`px-4 py-2 rounded ${viewMode === 'matrix' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Матрица цен
                        </button>
                    </div>
                )}
            </div>

            {viewMode === 'table' ? (
                <ResourceTable
                    resource={resource}
                    resourceName={resourceActionPostfix}
                    query={query}
                    setQuery={setQuery}
                    filterMode={hideFilters ? "none" : "default"}
                    sortMode="default"
                    hideDelete={false}
                    columns={[
                        { key: 'id', title: 'Ид', isSortable: true },
                        { key: 'distance', title: 'Distance', isSortable: true },
                        { key: 'price', title: 'Price', isSortable: true },
                        { key: 'wagonClass', title: 'WagonClass', isSortable: true, render: (value) => value?.name },
                        { key: 'season', title: 'Season', isSortable: true, render: (value) => value?.name },
                        { key: 'seatType', title: 'SeatType', isSortable: true, render: (value) => value?.name },
                        { key: 'from', title: 'From', isSortable: true, render: (value) => value?.name },
                        { key: 'to', title: 'To', isSortable: true, render: (value) => value?.name },
                        { key: 'seatTariff', title: 'SeatTariff', isSortable: true, render: (value) => value?.name },
                    ]}
                    filters={[
                        {
                            title: 'Ид',
                            key: 'id',
                        },
                        {
                            title: 'Distance',
                            key: 'distance',
                            type: 'number',
                        },
                        {
                            title: 'Price',
                            key: 'price',
                            type: 'number',
                        },
                        {
                            title: 'WagonClassId',
                            key: 'wagonClassId',
                            renderField: (fieldProps) => <WagonClassLookup resource={wagonClassesResource} {...fieldProps} />,
                        },
                        {
                            title: 'SeasonId',
                            key: 'seasonId',
                            renderField: (fieldProps) => <SeasonLookup resource={seasonsResource} {...fieldProps} />,
                        },
                        {
                            title: 'SeatTypeId',
                            key: 'seatTypeId',
                            renderField: (fieldProps) => <SeatTypeLookup resource={seatTypesResource} {...fieldProps} />,
                        },
                        {
                            title: 'FromId',
                            key: 'fromId',
                            renderField: (fieldProps) => <StationLookup resource={stationsResource} {...fieldProps} />,
                        },
                        {
                            title: 'ToId',
                            key: 'toId',
                            renderField: (fieldProps) => <StationLookup resource={stationsResource} {...fieldProps} />,
                        },
                        {
                            title: 'SeatTariffId',
                            key: 'seatTariffId',
                        },
                    ]}
                />
            ) : (
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-4">Матрица цен от станции к станции</h2>
                    {renderMatrixTable()}
                </div>
            )}

            {/* Calculation Parameters Dialog */}
            {calculationDialogShow && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Параметры расчета тарифа</h3>
                            <button
                                onClick={() => setCalculationDialogShow(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        {calculationData && calculationData.parsedExpression && (
                            <div className="space-y-4">
                                <div className="bg-white border rounded-lg p-4">
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-blue-600 mb-2">Итоговая цена: {calculationData.parsedExpression.result.toFixed(2)} ₸</h4>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {calculationData.parsedExpression.components.map((comp, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded border">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-medium text-gray-700">
                                                        {comp.value}
                                                    </span>
                                                    <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">
                                                        {comp.name}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {comp.explanation}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-4 pt-3 border-t">
                                        <div className="text-sm font-medium text-gray-700 mb-2">
                                            Пошаговый расчет:
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {calculationData.parsedExpression.components.map((comp, index) => (
                                                <div key={index} className="text-center">
                                                    <div className="text-xs text-gray-500 mb-1">
                                                        {comp.name}
                                                    </div>
                                                    <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                                        {comp.value}
                                                    </div>
                                                    {index < calculationData.parsedExpression.components.length - 1 && (
                                                        <span className="text-gray-400 mx-1">×</span>
                                                    )}
                                                </div>
                                            ))}
                                            <span className="text-gray-400 mx-1">=</span>
                                            <div className="text-center">
                                                <div className="text-xs text-gray-500 mb-1">Результат</div>
                                                <div className="text-sm font-mono bg-blue-100 px-2 py-1 rounded font-semibold">
                                                    {calculationData.parsedExpression.result.toFixed(2)} ₸
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setCalculationDialogShow(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
