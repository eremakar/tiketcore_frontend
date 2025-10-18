'use client';

import ResourceTable from "@/components/genA/resourceTable";
import useResource from "@/hooks/useResource";
import { useState } from "react";
import { asJSONSafe } from "@/components/genA/functions/json";

export default function Stations() {
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
    const resourceActionPostfix = "станция";

    const fetch = () => {
        setQuery({...query});
    }

    const map = (items) => {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.depots) {
                item.depots = asJSONSafe(item.depots);
            }
        }

        return items;
    }

    const resource = useResource('stations');
    return (
        <>
            <ResourceTable
                resource={resource}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode="default"
                sortMode="default"
                hideDelete={false}
                onMap={map}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    { key: 'name', title: 'Name', isSortable: true },
                    { key: 'code', title: 'Code', isSortable: true },
                    { key: 'shortName', title: 'ShortName', isSortable: true },
                    { key: 'shortNameLatin', title: 'ShortNameLatin', isSortable: true },
                    { key: 'depots', title: 'Depots', isSortable: true },
                    { key: 'isCity', title: 'IsCity', isSortable: true, render: (value) => value ? 'Да' : 'Нет' },
                    { key: 'cityCode', title: 'CityCode', isSortable: true },
                    { key: 'isSalePoint', title: 'IsSalePoint', isSortable: true, render: (value) => value ? 'Да' : 'Нет' }
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
                        title: 'ShortName',
                        key: 'shortName',
                        operator: 'like',
                    },
                    {
                        title: 'ShortNameLatin',
                        key: 'shortNameLatin',
                        operator: 'like',
                    },
                    {
                        title: 'Depots',
                        key: 'depots',
                    },
                    {
                        title: 'IsCity',
                        key: 'isCity',
                        type: 'boolean',
                    },
                    {
                        title: 'CityCode',
                        key: 'cityCode',
                        operator: 'like',
                    },
                    {
                        title: 'IsSalePoint',
                        key: 'isSalePoint',
                        type: 'boolean',
                    },
                ]}
            />
        </>
    )
}
