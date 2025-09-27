import ResourceLookup from "@/components/genA/resourceLookup";
import { formatDateTime } from "@/components/genA/functions/datetime";

export default function TrainScheduleLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'date', title: 'Date', isSortable: true, render: (value) => formatDateTime(value) },
                        { key: 'active', title: 'Active', isSortable: true, render: (value) => value ? 'Да' : 'Нет' },
                        { key: 'train', title: 'Train', isSortable: true, render: (value) => value?.name }
                    ],
                    filters: [
                        {
                            title: 'Ид',
                            key: 'id'
                        },
                        {
                            title: 'Date',
                            key: 'date',
                            type: 'datetime',
                        },
                        {
                            title: 'Active',
                            key: 'active',
                            type: 'boolean',
                        },
                        {
                            title: 'TrainId',
                            key: 'trainId'
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
