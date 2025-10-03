import ResourceLookup from "@/components/genA/resourceLookup";

export default function TariffTrainCategoryItemLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'trainCategory', title: 'TrainCategory', isSortable: true, render: (value) => value?.name },
                        { key: 'tariff', title: 'Tariff', isSortable: true, render: (value) => value?.name }
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
                            title: 'TrainCategoryId',
                            key: 'trainCategoryId'
                        },
                        {
                            title: 'TariffId',
                            key: 'tariffId'
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
