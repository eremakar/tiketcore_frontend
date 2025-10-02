'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useState, useEffect, useMemo } from "react";
import WagonLookup from "@/app/(defaults)/wagons/lookup";
import TariffLookup from "@/app/(defaults)/tarifications/tariffs/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";
import IconPlus from "@/components/icon/icon-plus";
import IconMinus from "@/components/icon/icon-minus";
import TariffSeatTypeItems from "@/app/(defaults)/tarifications/tariffSeatTypeItems/page";

export default function TariffWagonItems({ defaultQuery, hideFilters = false, defaultData, onDataChange }) {
    const [query, setQuery] = useState(defaultQuery || {
        paging: { skip: 0, take: 10 },
        filter: {},
        sort: {
            id: {
                operator: 'desc'
            }
        }
    });

    const [data, setData] = useState([]);
    const resourceActionPostfix = "элемент тарифа вагона";
    
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [currentExpandedWagonItemId, setCurrentExpandedWagonItemId] = useState(null);

    const wagonsResource = useResource('wagonModels');
    const tariffsResource = useResource('tariffs');

    const [wagons, setWagons] = useState(defaultData?.wagons || []);
    const [tariffs, setTariffs] = useState(defaultData?.tariffs || []);
    
    const hasTariffIdFilter = !!query?.filter?.tariffId;
    
    // Memoize tariff seat type items query to prevent unnecessary re-renders
    const tariffSeatTypeItemsQuery = useMemo(() => {
        if (!currentExpandedWagonItemId) return null;
        return {
            paging: { skip: 0, take: 5000 },
            filter: {
                tariffWagonId: {
                    operand1: currentExpandedWagonItemId,
                    operator: 'equals'
                }
            },
            sort: {
                id: { operator: 'asc' }
            }
        };
    }, [currentExpandedWagonItemId]);
    
    const toggleRowExpansion = (rowId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(rowId)) {
                newSet.delete(rowId);
                if (currentExpandedWagonItemId === rowId) {
                    setCurrentExpandedWagonItemId(null);
                }
            } else {
                newSet.add(rowId);
                setCurrentExpandedWagonItemId(rowId);
            }
            return newSet;
        });
    };

    useEffect(() => {
        if (defaultData?.wagons && defaultData?.tariffs) {
            setWagons(defaultData.wagons);
            setTariffs(defaultData.tariffs);
            return;
        }
        const fetchData = async () => {
            const [wagonsResponse, tariffsResponse] = await Promise.all([
                wagonsResource.search({ paging: { skip: 0, take: 1000 } }),
                tariffsResource.search({ paging: { skip: 0, take: 1000 } })
            ]);
            setWagons(wagonsResponse?.result || []);
            setTariffs(tariffsResponse?.result || []);
        };
        fetchData();
    }, [defaultData]);

    useEffect(() => {
        if (onDataChange && data.length > 0) {
            onDataChange();
        }
    }, [data]);

    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('tariffWagonItems')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode={hideFilters ? "none" : "default"}
                sortMode={hideFilters ? "none" : "default"}
                leftActions={true}
                renderExpandedRow={(wrappedRow) => {
                    const rowId = wrappedRow?.row?.id || wrappedRow?.id;
                    if (expandedRows.has(rowId) && tariffSeatTypeItemsQuery) {
                        return <TariffSeatTypeItems
                            defaultQuery={tariffSeatTypeItemsQuery}
                            hideFilters={true}
                        />;
                    }
                    return null;
                }}
                onChange={async (e) => {
                    const { type, target } = e;
                    if (type === dataTableEventTypeIds.newRow) {
                        const tariffId = query?.filter?.tariffId?.operand1;
                        if (tariffId) {
                            target.row.tariffId = tariffId;
                        }
                    }
                }}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    {
                        key: 'wagon',
                        title: 'Wagon',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: wagons,
                            relationMemberName: 'wagonId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name || ''
                    },
                    { key: 'indexCoefficient', title: 'IndexCoefficient', isSortable: true, editable: true, type: viewTypeIds.float },
                    ...(!hasTariffIdFilter ? [{
                        key: 'tariff',
                        title: 'Tariff',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: tariffs,
                            relationMemberName: 'tariffId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    }] : []),
                    {
                        key: 'seatTypeItems',
                        title: 'Типы мест',
                        isSortable: false,
                        style: { width: '100px' },
                        render: (value, row) => {
                            const rowId = row?.row?.id || row?.id;
                            const isExpanded = expandedRows.has(rowId);
                            return (
                                <button
                                    onClick={() => toggleRowExpansion(rowId)}
                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex items-center gap-1"
                                    title={isExpanded ? "Скрыть типы мест" : "Показать типы мест"}
                                >
                                    {isExpanded ? <IconMinus size={16} /> : <IconPlus size={16} />}
                                    <span className="text-sm">Развернуть</span>
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
                        title: 'IndexCoefficient',
                        key: 'indexCoefficient',
                        type: 'number',
                    },
                    {
                        title: 'WagonId',
                        key: 'wagonId',
                        renderField: (fieldProps) => <WagonLookup resource={wagonsResource} {...fieldProps} />,
                    },
                    {
                        title: 'TariffId',
                        key: 'tariffId',
                        renderField: (fieldProps) => <TariffLookup resource={tariffsResource} {...fieldProps} />,
                    },
                ]}
            />
        </>
    )
}
