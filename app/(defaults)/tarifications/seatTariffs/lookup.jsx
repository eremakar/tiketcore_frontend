import ResourceLookup from "@/components/genA/resourceLookup";

export default function SeatTariffLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'train', title: 'Train', isSortable: true, render: (value) => value?.name },
                        { key: 'baseFare', title: 'BaseFare', isSortable: true, render: (value) => value?.name },
                        { key: 'trainCategory', title: 'TrainCategory', isSortable: true, render: (value) => value?.name },
                        { key: 'items', title: 'Items', isSortable: true, render: (value) => value?.name }
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
                            title: 'TrainId',
                            key: 'trainId'
                        },
                        {
                            title: 'BaseFareId',
                            key: 'baseFareId'
                        },
                        {
                            title: 'TrainCategoryId',
                            key: 'trainCategoryId'
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
