import ResourceLookup from "@/components/genA/resourceLookup";

export default function RailwayLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'code', title: 'Code', isSortable: true },
                        { key: 'shortCode', title: 'ShortCode', isSortable: true },
                        { key: 'timeDifferenceFromAdministration', title: 'TimeDifferenceFromAdministration', isSortable: true },
                        { key: 'type', title: 'Type', isSortable: true },
                        { key: 'stations', title: 'Stations', isSortable: true, render: (value) => value?.name }
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
                            title: 'Code',
                            key: 'code',
                            operator: 'like',
                        },
                        {
                            title: 'ShortCode',
                            key: 'shortCode',
                            operator: 'like',
                        },
                        {
                            title: 'TimeDifferenceFromAdministration',
                            key: 'timeDifferenceFromAdministration',
                            type: 'number',
                        },
                        {
                            title: 'Type',
                            key: 'type',
                            operator: 'like',
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
