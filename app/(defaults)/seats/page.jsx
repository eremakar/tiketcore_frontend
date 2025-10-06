'use client';

import ResourceTable from "@/components/genA/resourceTable";
import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import TrainWagonLookup from "@/app/(defaults)/trainWagons/lookup";
import SeatTypeLookup from "@/app/(defaults)/seatTypes/lookup";
import WagonPurposeLookup from "@/app/(defaults)/wagonPurposes/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";

export default function Seats({ defaultQuery = null, fullHeight = false, hideFilters = false, ...props }) {
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
    const resourceActionPostfix = "место в вагоне";

    const resource = useResource('seats');
    const trainWagonsResource = useResource('trainWagons');
    const seatTypesResource = useResource('seatTypes');
    const wagonPurposesResource = useResource('wagonPurposes');
    const [seatTypes, setSeatTypes] = useState([]);
    const [wagonPurposes, setWagonPurposes] = useState([]);

    const fetch = () => {
        setQuery({...query});
    }

    const onMap = (items) => {        
        if (!items || !Array.isArray(items)) return items;
        
        // Sort by number as integer
        const result = items.sort((a, b) => {
            const numA = parseInt(a.number) || 0;
            const numB = parseInt(b.number) || 0;
            return numA - numB;
        });
        return result;
    }

    // Load seat types and wagon purposes for dropdown
    useEffect(() => {
        const loadSeatTypes = async () => {
            try {
                const seatTypesRes = await seatTypesResource.search({ paging: { skip: 0 } });
                setSeatTypes(seatTypesRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        const loadWagonPurposes = async () => {
            try {
                const wagonPurposesRes = await wagonPurposesResource.search({ paging: { skip: 0 } });
                setWagonPurposes(wagonPurposesRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        loadSeatTypes();
        loadWagonPurposes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update query when defaultQuery changes
    useEffect(() => {
        if (defaultQuery) {
            setQuery(defaultQuery);
        }
    }, [defaultQuery]);

    // Check if wagonId is filtered in query
    const isWagonFiltered = query?.filter?.wagonId || defaultQuery?.filter?.wagonId;

    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('seats')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode={hideFilters ? "none" : "default"}
                sortMode={hideFilters ? "none" : "default"}
                leftActions={true}
                enableCellEditOnDoubleClick={false}
                fullHeight={fullHeight}
                onMap={onMap}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                    {
                        key: 'number',
                        title: 'Number',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.int
                    },
                    //{ key: 'class', title: 'Class', isSortable: true },
                    ...(isWagonFiltered ? [] : [{
                        key: 'wagon',
                        title: 'Wagon',
                        isSortable: true,
                        render: (value) => value?.name
                    }]),
                    {
                        key: 'type',
                        title: 'Тип места',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: seatTypes,
                            relationMemberName: 'typeId',
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name || ''
                    },
                    {
                        key: 'purpose',
                        title: 'Назначение',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: wagonPurposes,
                            relationMemberName: 'purposeId',
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name || ''
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
                    // {
                    //     title: 'Class',
                    //     key: 'class',
                    //     type: 'number',
                    // },
                    {
                        title: 'WagonId',
                        key: 'wagonId',
                        renderField: (fieldProps) => <TrainWagonLookup resource={trainWagonsResource} {...fieldProps} />,
                    },
                    {
                        title: 'Тип места',
                        key: 'typeId',
                        renderField: (fieldProps) => <SeatTypeLookup resource={seatTypesResource} {...fieldProps} />,
                    },
                    {
                        title: 'Назначение',
                        key: 'purposeId',
                        renderField: (fieldProps) => <WagonPurposeLookup resource={wagonPurposesResource} {...fieldProps} />,
                    },
                ]}
                {...props}
            />
        </>
    )
}
