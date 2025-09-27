'use client';

import ResourceTable from "@/components/genA/resourceTable";
import useResource from "@/hooks/useResource";
import { useState } from "react";

export default function SeatTypes() {
    const [query, setQuery] = useState({
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

    const [row, setRow] = useState(null);
    const resourceActionPostfix = "тип места";

    const fetch = () => {
        setQuery({...query});
    }

    const resource = useResource('seatTypes');
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
                    { key: 'code', title: 'Code', isSortable: true },
                    { key: 'tarifCoefficient', title: 'Тарифный коэффициент', isSortable: true }
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
                        title: 'Тарифный коэффициент',
                        key: 'tarifCoefficient',
                        type: 'number',
                    },
                ]}
            />
        </>
    )
}
