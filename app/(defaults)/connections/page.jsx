'use client';

import ResourceTable from "@/components/genA/resourceTable";
import useResource from "@/hooks/useResource";
import { useState } from "react";
import StationLookup from "@/app/(defaults)/stations/lookup";

export default function Connections() {
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
    const resourceActionPostfix = "соединение 2х станций";

    const fetch = () => {
        setQuery({...query});
    }

    const resource = useResource('connections');
    const stationsResource = useResource('stations');
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
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    { key: 'name', title: 'Name', isSortable: true },
                    { key: 'distanceKm', title: 'DistanceKm', isSortable: true },
                    { key: 'from', title: 'From', isSortable: true, render: (value) => value?.name },
                    { key: 'to', title: 'To', isSortable: true, render: (value) => value?.name },
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
                        title: 'DistanceKm',
                        key: 'distanceKm',
                        type: 'number',
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
                ]}
            />
        </>
    )
}
