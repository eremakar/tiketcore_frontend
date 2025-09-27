import ResourceLookup from "@/components/genA/resourceLookup";
import { formatDateTime } from "@/components/genA/functions/datetime";

export default function SeatReservationLookup({useResource, resource, name, label, options, ...props}) {
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
                        { key: 'date', title: 'Date', isSortable: true, render: (value) => formatDateTime(value) },
                        { key: 'price', title: 'Price', isSortable: true },
                        { key: 'total', title: 'Total', isSortable: true },
                        { key: 'from', title: 'From', isSortable: true, render: (value) => value?.name },
                        { key: 'to', title: 'To', isSortable: true, render: (value) => value?.name },
                        { key: 'train', title: 'Train', isSortable: true, render: (value) => value?.name },
                        { key: 'wagon', title: 'Wagon', isSortable: true, render: (value) => value?.name },
                        { key: 'seat', title: 'Seat', isSortable: true, render: (value) => value?.name },
                        { key: 'trainSchedule', title: 'TrainSchedule', isSortable: true, render: (value) => value?.name },
                        { key: 'segments', title: 'Segments', isSortable: true, render: (value) => value?.name }
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
                            title: 'Date',
                            key: 'date',
                            type: 'datetime',
                        },
                        {
                            title: 'Price',
                            key: 'price',
                            type: 'number',
                        },
                        {
                            title: 'Total',
                            key: 'total',
                            operator: 'like',
                        },
                        {
                            title: 'FromId',
                            key: 'fromId'
                        },
                        {
                            title: 'ToId',
                            key: 'toId'
                        },
                        {
                            title: 'TrainId',
                            key: 'trainId'
                        },
                        {
                            title: 'WagonId',
                            key: 'wagonId'
                        },
                        {
                            title: 'SeatId',
                            key: 'seatId'
                        },
                        {
                            title: 'TrainScheduleId',
                            key: 'trainScheduleId'
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
