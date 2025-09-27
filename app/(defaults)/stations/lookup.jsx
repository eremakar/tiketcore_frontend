import ResourceLookup from "@/components/genA/resourceLookup";

export default function StationLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'shortName', title: 'ShortName', isSortable: true },
                        { key: 'shortNameLatin', title: 'ShortNameLatin', isSortable: true },
                        { key: 'depots', title: 'Depots', isSortable: true },
                        { key: 'isCity', title: 'IsCity', isSortable: true, render: (value) => value ? 'Да' : 'Нет' },
                        { key: 'cityCode', title: 'CityCode', isSortable: true },
                        { key: 'isSalePoint', title: 'IsSalePoint', isSortable: true, render: (value) => value ? 'Да' : 'Нет' }
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
                            title: 'ShortName',
                            key: 'shortName',
                            operator: 'like',
                        },
                        {
                            title: 'ShortNameLatin',
                            key: 'shortNameLatin',
                            operator: 'like',
                        },
                        {
                            title: 'Depots',
                            key: 'depots'
                        },
                        {
                            title: 'IsCity',
                            key: 'isCity',
                            type: 'boolean',
                        },
                        {
                            title: 'CityCode',
                            key: 'cityCode',
                            operator: 'like',
                        },
                        {
                            title: 'IsSalePoint',
                            key: 'isSalePoint',
                            type: 'boolean',
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
