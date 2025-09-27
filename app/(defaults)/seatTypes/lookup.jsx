import ResourceLookup from "@/components/genA/resourceLookup";

export default function SeatTypeLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'tarifCoefficient', title: 'Тарифный коэффициент', isSortable: true }
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
                            title: 'Тарифный коэффициент',
                            key: 'tarifCoefficient',
                            type: 'number',
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
