'use client';

import ResourceTable from "@/components/genA/resourceTable";
import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useEffect, useState, useMemo } from "react";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";
import IconRefresh from "@/components/icon/icon-refresh";
import IconPlus from "@/components/icon/icon-plus";
import IconMinus from "@/components/icon/icon-minus";
import Seats from "@/app/(defaults)/seats/page";

export default function Wagons({ defaultQuery = null, fullHeight = false, onDataChange = null, hideFilters = false, ...props }) {
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
    const resourceActionPostfix = "вагон (тип)";

    const wagonTypesResource = useResource('wagonTypes');
    const wagonsResource = useResource('wagonModels');
    const [wagonTypes, setWagonTypes] = useState([]);

    // Memoize seats query to prevent unnecessary re-renders
    const seatsQuery = useMemo(() => {
        if (!currentExpandedWagonId) return null;
        return {
            paging: { skip: 0, take: 5000 },
            filter: {
                wagonId: {
                    operand1: currentExpandedWagonId,
                    operator: 'equals'
                }
            },
            sort: {
                number: { operator: 'asc' }
            }
        };
    }, [currentExpandedWagonId]);

    const fetch = () => {
        setQuery({...query});
    }

    const handleGenerateSeats = async (wrappedRow) => {
        try {
            const row = wrappedRow?.row || wrappedRow;
            const wagonModelId = row.id || row.key;
            if (!wagonModelId) {
                console.error('Wagon Model ID is undefined');
                return;
            }

            // POST request to generate seats
            await wagonsResource.post(`/${wagonModelId}/seats/generate`);

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

    const map = (items) => {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.pictureS3) {
                item.pictureS3 = asJSONSafe(item.pictureS3);
            }
        }

        return items;
    }

    // Load wagon types for dropdown
    useEffect(() => {
        const loadWagonTypes = async () => {
            try {
                const wagonTypesRes = await wagonTypesResource.search({ paging: { skip: 0 } });
                setWagonTypes(wagonTypesRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        loadWagonTypes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update query when defaultQuery changes
    useEffect(() => {
        if (defaultQuery) {
            setQuery(defaultQuery);
        }
    }, [defaultQuery]);
    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('wagonModels')}
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
                    if (expandedRows.has(rowId) && seatsQuery) {
                        return <Seats
                            defaultQuery={seatsQuery}
                            hideFilters={true}
                            fullHeight={false}
                        />;
                    }
                    return null;
                }}
                onChange={async (e) => {
                    // Notify parent component about data changes only when saving
                    if (e.type === dataTableEventTypeIds.commitRow && onDataChange) {
                        onDataChange();
                    }
                }}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                    {
                        key: 'name',
                        title: 'Name',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.text
                    },
                    {
                        key: 'type',
                        title: 'Type',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: wagonTypes,
                            relationMemberName: 'typeId',
                            props: { mode: 'portal', labelMemberName: 'shortName', valueMemberName: 'id' }
                        },
                        render: (value) => value?.shortName || ''
                    },
                    {
                        key: 'seatCount',
                        title: 'SeatCount',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.int
                    },
                    {
                        key: 'pictureS3',
                        title: 'PictureS3',
                        isSortable: true,
                        editable: false,
                        type: viewTypeIds.text
                    },
                    // {
                    //     key: 'class',
                    //     title: 'Class',
                    //     isSortable: true,
                    //     editable: true,
                    //     type: viewTypeIds.text
                    // },
                    {
                        key: 'seats',
                        title: 'Seats',
                        isSortable: false,
                        style: { width: '100px' },
                        render: (value, row) => {
                            const rowId = row?.row?.id || row?.id;
                            const isExpanded = expandedRows.has(rowId);
                            return (
                                <button
                                    onClick={() => toggleRowExpansion(rowId)}
                                    className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex items-center gap-1"
                                    title={isExpanded ? "Скрыть места" : "Показать места"}
                                >
                                    {isExpanded ? <IconMinus size={16} /> : <IconPlus size={16} />}
                                    <span className="text-sm">Показать</span>
                                </button>
                            );
                        }
                    },
                    {
                        key: 'actions',
                        title: 'Действия',
                        isSortable: false,
                        style: { width: '100px' },
                        render: (value, row) => (
                            <button
                                onClick={() => handleGenerateSeats(row)}
                                className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                title="Сгенерировать места"
                            >
                                <IconRefresh size={16} />
                            </button>
                        )
                    }
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
                        title: 'Type',
                        key: 'type',
                        operator: 'like',
                    },
                    {
                        title: 'SeatCount',
                        key: 'seatCount',
                        type: 'number',
                    },
                    {
                        title: 'PictureS3',
                        key: 'pictureS3',
                    },
                    {
                        title: 'Class',
                        key: 'class',
                        operator: 'like',
                    },
                ]}
                {...props}
            />
        </>
    )
}
