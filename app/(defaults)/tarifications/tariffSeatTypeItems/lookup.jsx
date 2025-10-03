import ResourceLookup from "@/components/genA/resourceLookup";

export default function TariffSeatTypeItemLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'indexCoefficient', title: 'IndexCoefficient', isSortable: true },
                        { key: 'seatType', title: 'SeatType', isSortable: true, render: (value) => value?.name },
                        { key: 'tariffWagon', title: 'TariffWagon', isSortable: true, render: (value) => value?.name }
                    ],
                    filters: [
                        {
                            title: 'Ид',
                            key: 'id'
                        },
                        {
                            title: 'IndexCoefficient',
                            key: 'indexCoefficient',
                            type: 'number',
                        },
                        {
                            title: 'SeatTypeId',
                            key: 'seatTypeId'
                        },
                        {
                            title: 'TariffWagonId',
                            key: 'tariffWagonId'
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
