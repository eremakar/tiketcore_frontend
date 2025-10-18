'use client';

import ResourceTable from "@/components/genA/resourceTable";
import useResource from "@/hooks/useResource";
import { useState } from "react";
import { formatDateTime } from "@/components/genA/functions/datetime";
import BaseFareLookup from "@/app/(defaults)/tarifications/baseFares/lookup";
import TrainLookup from "@/app/(defaults)/trains/lookup";
import TrainCategoryLookup from "@/app/(defaults)/tarifications/trainCategories/lookup";
import WagonClassLookup from "@/app/(defaults)/tarifications/wagonClasses/lookup";
import SeasonLookup from "@/app/(defaults)/tarifications/seasons/lookup";
import SeatTypeLookup from "@/app/(defaults)/seatTypes/lookup";
import ConnectionLookup from "@/app/(defaults)/connections/lookup";

export default function SeatTariffHistories() {
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
    const resourceActionPostfix = "история тарифа места в вагоне";

    const fetch = () => {
        setQuery({...query});
    }

    const resource = useResource('seatTariffHistories');
    const baseFaresResource = useResource('baseFares');
    const trainsResource = useResource('trains');
    const trainCategoriesResource = useResource('trainCategories');
    const wagonClassesResource = useResource('wagonClasses');
    const seasonsResource = useResource('seasons');
    const seatTypesResource = useResource('seatTypes');
    const connectionsResource = useResource('connections');
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
                    { key: 'price', title: 'Price', isSortable: true },
                    { key: 'dateTime', title: 'DateTime', isSortable: true, render: (value) => formatDateTime(value) },
                    { key: 'baseFare', title: 'BaseFare', isSortable: true, render: (value) => value?.name },
                    { key: 'train', title: 'Train', isSortable: true, render: (value) => value?.name },
                    { key: 'trainCategory', title: 'TrainCategory', isSortable: true, render: (value) => value?.name },
                    { key: 'wagonClass', title: 'WagonClass', isSortable: true, render: (value) => value?.name },
                    { key: 'season', title: 'Season', isSortable: true, render: (value) => value?.name },
                    { key: 'seatType', title: 'SeatType', isSortable: true, render: (value) => value?.name },
                    { key: 'connection', title: 'соединение станций', isSortable: true, render: (value) => value?.name },
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
                    {
                        title: 'DateTime',
                        key: 'dateTime',
                        type: 'datetime',
                    },
                    {
                        title: 'BaseFareId',
                        key: 'baseFareId',
                        renderField: (fieldProps) => <BaseFareLookup resource={baseFaresResource} {...fieldProps} />,
                    },
                    {
                        title: 'TrainId',
                        key: 'trainId',
                        renderField: (fieldProps) => <TrainLookup resource={trainsResource} {...fieldProps} />,
                    },
                    {
                        title: 'TrainCategoryId',
                        key: 'trainCategoryId',
                        renderField: (fieldProps) => <TrainCategoryLookup resource={trainCategoriesResource} {...fieldProps} />,
                    },
                    {
                        title: 'WagonClassId',
                        key: 'wagonClassId',
                        renderField: (fieldProps) => <WagonClassLookup resource={wagonClassesResource} {...fieldProps} />,
                    },
                    {
                        title: 'SeasonId',
                        key: 'seasonId',
                        renderField: (fieldProps) => <SeasonLookup resource={seasonsResource} {...fieldProps} />,
                    },
                    {
                        title: 'SeatTypeId',
                        key: 'seatTypeId',
                        renderField: (fieldProps) => <SeatTypeLookup resource={seatTypesResource} {...fieldProps} />,
                    },
                    {
                        title: 'соединение станций',
                        key: 'connectionId',
                        renderField: (fieldProps) => <ConnectionLookup resource={connectionsResource} {...fieldProps} />,
                    },
                ]}
            />
        </>
    )
}
