import ResourceLookup from "@/components/genA/resourceLookup";

export default function TariffLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'indexCoefficient', title: 'IndexCoefficient', isSortable: true },
                        { key: 'vAT', title: 'VAT', isSortable: true },
                        { key: 'baseFare', title: 'BaseFare', isSortable: true, render: (value) => value?.name },
                        { key: 'trainCategory', title: 'TrainCategory', isSortable: true, render: (value) => value?.name },
                        { key: 'wagon', title: 'Wagon', isSortable: true, render: (value) => value?.name }
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
                            title: 'IndexCoefficient',
                            key: 'indexCoefficient',
                            type: 'number',
                        },
                        {
                            title: 'VAT',
                            key: 'vAT',
                            type: 'number',
                        },
                        {
                            title: 'BaseFareId',
                            key: 'baseFareId'
                        },
                        {
                            title: 'TrainCategoryId',
                            key: 'trainCategoryId'
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
