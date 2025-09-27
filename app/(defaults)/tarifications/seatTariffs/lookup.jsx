import ResourceLookup from "@/components/genA/resourceLookup";

export default function SeatTariffLookup({useResource, resource, name, label, options, ...props}) {
    resource = useResource ? useResource() : resource;

    return (
        <ResourceLookup
            resource = {resource}
            name={name}
            label={label}
            options={{
                ...options,
                table: {
                    ...options?.table,
                    columns: [
                        { key: 'id', title: 'Ид', isSortable: true },
                        { key: 'name', title: 'Name', isSortable: true },
                        { key: 'price', title: 'Price', isSortable: true },
                        { key: 'baseFare', title: 'BaseFare', isSortable: true, render: (value) => value?.name },
                        { key: 'train', title: 'Train', isSortable: true, render: (value) => value?.name },
                        { key: 'trainCategory', title: 'TrainCategory', isSortable: true, render: (value) => value?.name },
                        { key: 'wagonClass', title: 'WagonClass', isSortable: true, render: (value) => value?.name },
                        { key: 'season', title: 'Season', isSortable: true, render: (value) => value?.name },
                        { key: 'seatType', title: 'SeatType', isSortable: true, render: (value) => value?.name },
                        { key: 'connection', title: 'соединение станций', isSortable: true, render: (value) => value?.name }
                    ],
                    filters: [
                        {
                            title: 'Ид',
                            key: 'id'
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
                            title: 'BaseFareId',
                            key: 'baseFareId'
                        },
                        {
                            title: 'TrainId',
                            key: 'trainId'
                        },
                        {
                            title: 'TrainCategoryId',
                            key: 'trainCategoryId'
                        },
                        {
                            title: 'WagonClassId',
                            key: 'wagonClassId'
                        },
                        {
                            title: 'SeasonId',
                            key: 'seasonId'
                        },
                        {
                            title: 'SeatTypeId',
                            key: 'seatTypeId'
                        },
                        {
                            title: 'соединение станций',
                            key: 'connectionId'
                        }
                    ],
                    actions: {}
                }
            }}
            getRow={async (value) => {
                if (!value) {
                    return;
                }
                return await resource.get(value);
            }}
            {...props}
        />
    )
}
