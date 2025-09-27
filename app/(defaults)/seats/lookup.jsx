import ResourceLookup from "@/components/genA/resourceLookup";

export default function SeatLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'number', title: 'Number', isSortable: true },
                        { key: 'class', title: 'Class', isSortable: true },
                        { key: 'wagon', title: 'Wagon', isSortable: true, render: (value) => value?.name },
                        { key: 'type', title: 'Тип места: верхний/боковой/нижний', isSortable: true, render: (value) => value?.name }
                    ],
                    filters: [
                        {
                            title: 'Ид',
                            key: 'id'
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
                            key: 'wagonId'
                        },
                        {
                            title: 'Тип места: верхний/боковой/нижний',
                            key: 'typeId'
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
