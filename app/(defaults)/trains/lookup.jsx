import ResourceLookup from "@/components/genA/resourceLookup";

export default function TrainLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'type', title: 'Тип поезда, например Тальго', isSortable: true },
                        { key: 'zoneType', title: 'Зональность: пригородный, общий и т.п.', isSortable: true },
                        { key: 'from', title: 'From', isSortable: true, render: (value) => value?.name },
                        { key: 'to', title: 'To', isSortable: true, render: (value) => value?.name },
                        { key: 'route', title: 'Route', isSortable: true, render: (value) => value?.name }
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
                            title: 'Тип поезда, например Тальго',
                            key: 'type',
                            type: 'number',
                        },
                        {
                            title: 'Зональность: пригородный, общий и т.п.',
                            key: 'zoneType',
                            type: 'number',
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
                            title: 'RouteId',
                            key: 'routeId'
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
