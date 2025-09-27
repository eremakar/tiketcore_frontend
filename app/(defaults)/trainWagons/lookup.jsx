import ResourceLookup from "@/components/genA/resourceLookup";

export default function TrainWagonLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'trainSchedule', title: 'TrainSchedule', isSortable: true, render: (value) => value?.name },
                        { key: 'wagon', title: 'Wagon', isSortable: true, render: (value) => value?.name }
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
                            title: 'TrainScheduleId',
                            key: 'trainScheduleId'
                        },
                        {
                            title: 'WagonId',
                            key: 'wagonId'
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
