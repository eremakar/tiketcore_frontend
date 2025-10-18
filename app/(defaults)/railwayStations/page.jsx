'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import StationLookup from "@/app/(defaults)/stations/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";

export default function RailwayStations({ defaultQuery = null, fullHeight = false, hideFilters = false, onDataChange = null, ...props }) {
    const [query, setQuery] = useState(defaultQuery || {
        paging: { skip: 0, take: 100 },
        filter: {},
        sort: {
            id: {
                operator: 'asc'
            }
        }
    });

    const [createShow, setCreateShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [detailsShow, setDetailsShow] = useState(false);

    const [data, setData] = useState(null);
    const [row, setRow] = useState(null);
    const resourceActionPostfix = "станция дороги";

    const fetch = () => {
        setQuery({...query});
    }

    // Update query when defaultQuery changes
    useEffect(() => {
        if (defaultQuery) {
            setQuery(defaultQuery);
        }
    }, [defaultQuery]);

    // Check if railwayId is filtered in query
    const isRailwayFiltered = query?.filter?.railwayId || defaultQuery?.filter?.railwayId;

    const stationsResource = useResource('stations');
    const railwaysResource = useResource('railwaies');
    const [stations, setStations] = useState([]);
    const [railways, setRailways] = useState([]);

    // Load stations and railways for dropdowns
    useEffect(() => {
        const loadData = async () => {
            try {
                const [stRes, rwRes] = await Promise.all([
                    stationsResource.search({ paging: { skip: 0 } }),
                    railwaysResource.search({ paging: { skip: 0 } })
                ]);
                setStations(stRes?.result || []);
                setRailways(rwRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('railwayStations')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode={hideFilters ? "none" : "default"}
                sortMode={hideFilters ? "none" : "default"}
                leftActions={true}
                fullHeight={fullHeight}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                    {
                        key: 'station',
                        title: 'Station',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: stations,
                            relationMemberName: 'stationId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
                    {
                        key: 'stationCode',
                        title: 'Код станции',
                        isSortable: false,
                        render: (_, wrappedRow) => wrappedRow?.row?.station?.code || ''
                    },
                    ...(isRailwayFiltered ? [] : [{
                        key: 'railway',
                        title: 'Railway',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: railways,
                            relationMemberName: 'railwayId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    }]),
                    { key: 'distance', title: 'Distance', isSortable: true, editable: true, type: viewTypeIds.int },
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
                    },
                    {
                        title: 'StationId',
                        key: 'stationId',
                        renderField: (fieldProps) => <StationLookup resource={stationsResource} {...fieldProps} />,
                    },
                    {
                        title: 'RailwayId',
                        key: 'railwayId',
                    },
                ]}
                {...props}
            />
        </>
    )
}
