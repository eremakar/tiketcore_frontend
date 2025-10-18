'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useState } from "react";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";

export default function BaseFares() {
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

    const [row, setRow] = useState(null);
    const [data, setData] = useState([]);
    const resourceActionPostfix = "базовая ставка";

    const fetch = () => {
        setQuery({...query});
    }

    const resource = useResource('baseFares');
    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('baseFares')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode="default"
                sortMode="default"
                leftActions={true}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    { key: 'name', title: 'Name', isSortable: true, editable: true, type: viewTypeIds.text },
                    { key: 'price', title: 'Price', isSortable: true, editable: true, type: viewTypeIds.float, decimalPlaces: 3 }
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
                        title: 'Price',
                        key: 'price',
                        type: 'number',
                    },
                ]}
            />
        </>
    )
}
