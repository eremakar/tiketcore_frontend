import ResourceLookup from "@/components/genA/resourceLookup";
import useResourceHook from "@/hooks/useResource";
import { useState } from "react";

export default function RailwayStationLookup({useResource, resource, name, label, options, ...props}) {
    resource = useResource ? useResource() : resource;

    const railwaiesResource = useResourceHook('railwaies');

    const [query, setQuery] = useState({
        paging: { skip: 0, take: 100 },
        filter: {},
        sort: {
            id: {
                operator: 'asc'
            }
        }
    });

    return (
        <ResourceLookup
            resource = {resource}
            name={name}
            label={label}
            options={{
                ...options,
                table: {
                    ...options?.table,
                    filterMode: 'inline',
                    initialShowFilter: true,
                    // query: {
                    //     paging: { skip: 0, take: 100 },
                    //     filter: {},
                    //     sort: {
                    //         id: {
                    //             operator: 'asc'
                    //         }
                    //     }
                    // },
                    columns: [
                        { key: 'id', title: 'Ид', isSortable: true },
                        { key: 'station', title: 'Station', isSortable: true, render: (value) => value?.name },
                        { key: 'railway', title: 'Railway', isSortable: true, render: (value) => value?.name }
                    ],
                    filters: [
                        {
                            title: 'Ид',
                            key: 'id'
                        },
                        {
                            title: 'RailwayId',
                            key: 'railwayId',
                            type: 'resourceselect',
                            props: {
                                resource: railwaiesResource,
                                valueMemberName: 'id',
                                labelMemberName: 'name',
                                placeholder: 'Выберите железную дорогу'
                            },
                            operator: 'equals'
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
