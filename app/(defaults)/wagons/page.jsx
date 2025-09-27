'use client';

import ResourceTable from "@/components/genA/resourceTable";
import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useEffect, useState } from "react";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";

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
    const resourceActionPostfix = "вагон (тип)";

    const wagonTypesResource = useResource('wagonTypes');
    const [wagonTypes, setWagonTypes] = useState([]);

    const fetch = () => {
        setQuery({...query});
    }

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
                useResource={() => useResource('wagons')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode={hideFilters ? "none" : "default"}
                sortMode={hideFilters ? "none" : "default"}
                leftActions={true}
                enableCellEditOnDoubleClick={false}
                fullHeight={fullHeight}
                onChange={async (e) => {
                    // Notify parent component about data changes only when saving
                    if (e.type === dataTableEventTypeIds.commitRow && onDataChange) {
                        onDataChange();
                    }
                }}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
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
                    {
                        key: 'class',
                        title: 'Class',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.text
                    }
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
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
