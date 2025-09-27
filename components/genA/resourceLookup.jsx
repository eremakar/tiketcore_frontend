import React, { useEffect } from "react";
import { useState } from "react";
import Lookup from "./lookup";
import ResourceTable from "./resourceTable";

export default function ResourceLookup({useResource, name, resourceName, options, formatValue, valueMemberName = 'id', labelMemberName = 'name',
    fullWidth = true, placeholder, getRow, value, lookupValue, onChange, onRowChange, anonymous, ...props}) {
    const [row, setRow] = useState(null);
    const [query, setQuery] = useState(options?.table?.query || {
        paging: { skip: 0, take: 10 },
        filter: {},
        sort: {
            id: {
                operator: 'asc'
            }
        }
    });

    useEffect(() => {
        if (!value)
            setRow(null);
    }, [value]);

    const formatValue2 = formatValue || ((row) => row ? row[labelMemberName] : "");

    const fetchRow = async () => {
        if (row) {
            const id = row[valueMemberName];
            if (id == value)
                return;
        }

        if (!getRow)
            return;

        const response = await getRow(value);
        setRow(response);
    }

    useEffect(() => {
        if (!value)
            return;

        fetchRow();
    }, [value]);

    return (
        <Lookup name={name}
            value={row}
            lookupValue={lookupValue}
            formatValue={formatValue2}
            options={{
                details: {
                    ...options?.details,
                    resourceName: resourceName
                },
                table: {
                    ...options?.table,
                    useResource: useResource,
                    render: (_, setDetailsShow) => {
                        return <ResourceTable query={query} setQuery={setQuery} {..._?.table} anonymous={anonymous} {...props} actions={{
                            onSelect: (row) => {
                                setRow(row);

                                const id = row[valueMemberName];

                                onChange && onChange(id);
                                onRowChange && onRowChange(row);
                                setDetailsShow(false);
                            }
                        }}/>
                    }
                }
            }} fullWidth={fullWidth} placeholder={placeholder} onChange={(row) => {
                setRow(row);
                //const id = row[valueMemberName];
                onChange && onChange(row);
            }} {...props}>
        </Lookup>
    );
}
