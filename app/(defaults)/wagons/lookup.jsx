import ResourceLookup from "@/components/genA/resourceLookup";

export default function WagonLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'type', title: 'Type', isSortable: true },
                        { key: 'seatCount', title: 'SeatCount', isSortable: true },
                        { key: 'pictureS3', title: 'PictureS3', isSortable: true },
                        { key: 'class', title: 'Class', isSortable: true }
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
                            title: 'Type',
                            key: 'type',
                            operator: 'like',
                        },
                        {
                            title: 'SeatCount',
                            key: 'seatCount',
                            type: 'number',
                        },
                        {
                            title: 'PictureS3',
                            key: 'pictureS3'
                        },
                        {
                            title: 'Class',
                            key: 'class',
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
