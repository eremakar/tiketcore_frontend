import ResourceLookup from "@/components/genA/resourceLookup";

export default function SeatTariffItemLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'distance', title: 'Distance', isSortable: true },
                        { key: 'price', title: 'Price', isSortable: true },
                        { key: 'wagonClass', title: 'WagonClass', isSortable: true, render: (value) => value?.name },
                        { key: 'season', title: 'Season', isSortable: true, render: (value) => value?.name },
                        { key: 'seatType', title: 'SeatType', isSortable: true, render: (value) => value?.name },
                        { key: 'from', title: 'From', isSortable: true, render: (value) => value?.name },
                        { key: 'to', title: 'To', isSortable: true, render: (value) => value?.name },
                        { key: 'seatTariff', title: 'SeatTariff', isSortable: true, render: (value) => value?.name }
                    ],
                    filters: [
                        {
                            title: 'Ид',
                            key: 'id'
                        },
                        {
                            title: 'Distance',
                            key: 'distance',
                            type: 'number',
                        },
                        {
                            title: 'Price',
                            key: 'price',
                            type: 'number',
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
                            title: 'FromId',
                            key: 'fromId'
                        },
                        {
                            title: 'ToId',
                            key: 'toId'
                        },
                        {
                            title: 'SeatTariffId',
                            key: 'seatTariffId'
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
