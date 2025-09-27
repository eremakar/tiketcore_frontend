'use client';

import ResourceTable from "@/components/genA/resourceTable";
import useResource from "@/hooks/useResource";
import { useState } from "react";
import TrainWagonLookup from "@/app/(defaults)/trainWagons/lookup";
import SeatTypeLookup from "@/app/(defaults)/seatTypes/lookup";

export default function Seats() {
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
    const resourceActionPostfix = "место в вагоне";

    const fetch = () => {
        setQuery({...query});
    }

    const resource = useResource('seats');
    const trainWagonsResource = useResource('trainWagons');
    const seatTypesResource = useResource('seatTypes');
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
                    { key: 'number', title: 'Number', isSortable: true },
                    { key: 'class', title: 'Class', isSortable: true },
                    { key: 'wagon', title: 'Wagon', isSortable: true, render: (value) => value?.name },
                    { key: 'type', title: 'Тип места: верхний/боковой/нижний', isSortable: true, render: (value) => value?.name },
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
                    {
                        title: 'Class',
                        key: 'class',
                        type: 'number',
                    },
                    {
                        title: 'WagonId',
                        key: 'wagonId',
                        renderField: (fieldProps) => <TrainWagonLookup resource={trainWagonsResource} {...fieldProps} />,
                    },
                    {
                        title: 'Тип места: верхний/боковой/нижний',
                        key: 'typeId',
                        renderField: (fieldProps) => <SeatTypeLookup resource={seatTypesResource} {...fieldProps} />,
                    },
                ]}
            />
        </>
    )
}
