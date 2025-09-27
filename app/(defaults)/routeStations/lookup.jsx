import ResourceLookup from "@/components/genA/resourceLookup";
import { formatDurationFromEpoch } from "@/components/genA/functions/datetime";

export default function RouteStationLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'route', title: 'Маршрут', isSortable: true, render: (value) => value?.name },
                        { key: 'order', title: 'Порядок следования', isSortable: true },
                        { key: 'station', title: 'Станция', isSortable: true, render: (value) => value?.name },
                        { key: 'arrival', title: 'Время прибытия', isSortable: true, render: (value) => formatDurationFromEpoch(value) },
                        { key: 'stop', title: 'Остановка', isSortable: true, render: (value) => formatDurationFromEpoch(value) },
                        { key: 'departure', title: 'Время отправления', isSortable: true, render: (value) => formatDurationFromEpoch(value) }
                    ],
                    filters: [
                        {
                            title: 'Ид',
                            key: 'id'
                        },
                        {
                            title: 'Порядок следования',
                            key: 'order',
                            type: 'number',
                        },
                        {
                            title: 'Время прибытия',
                            key: 'arrival',
                            type: 'datetime',
                        },
                        {
                            title: 'Остановка',
                            key: 'stop',
                            type: 'datetime',
                        },
                        {
                            title: 'Время отправления',
                            key: 'departure',
                            type: 'datetime',
                        },
                        {
                            title: 'StationId',
                            key: 'stationId'
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
