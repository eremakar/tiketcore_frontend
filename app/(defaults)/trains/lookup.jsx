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
                details: {
                    ...options?.details,
                    size: '[95vw]'
                },
                table: {
                    ...options?.table,
                    columns: [
                        { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                        { key: 'name', title: 'Название', isSortable: true },
                        { key: 'type', title: 'Тип поезда', isSortable: true, render: (value) => value?.name },
                        { key: 'zoneType', title: 'Зональность', isSortable: true, render: (value) => ({ 1: 'Пригородный', 2: 'Общий' }[value] || value) },
                        { key: 'from', title: 'Откуда', isSortable: true, render: (value) => value?.name },
                        { key: 'to', title: 'Куда', isSortable: true, render: (value) => value?.name },
                        { key: 'route', title: 'Маршрут', isSortable: true, render: (value) => value?.name },
                        { key: 'plan', title: 'План вагонов', isSortable: true, render: (value) => value?.name },
                        { key: 'category', title: 'Категория', isSortable: true, render: (value) => value?.name },
                        { key: 'periodicity', title: 'Периодичность', isSortable: true, render: (value) => value?.name }
                    ],
                    filters: [
                        {
                            title: 'Ид',
                            key: 'id'
                        },
                        {
                            title: 'Название',
                            key: 'name',
                            operator: 'like',
                        },
                        {
                            title: 'Тип поезда',
                            key: 'type',
                        },
                        {
                            title: 'Зональность',
                            key: 'zoneType',
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
                        },
                        {
                            title: 'PlanId',
                            key: 'planId'
                        },
                        {
                            title: 'CategoryId',
                            key: 'categoryId'
                        },
                        {
                            title: 'PeriodicityId',
                            key: 'periodicityId'
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
