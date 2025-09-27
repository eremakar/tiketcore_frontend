'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import WagonLookup from "@/app/(defaults)/wagons/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";

export default function TrainWagonsPlanWagons({ defaultQuery, fullHeight, onDataChange, isFilter, isSort }) {
    const [query, setQuery] = useState(defaultQuery || {
        paging: { skip: 0, take: 10 },
        filter: {},
        sort: {
            id: {
                operator: 'desc'
            }
        }
    });

    const [createShow, setCreateShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [detailsShow, setDetailsShow] = useState(false);

    const [data, setData] = useState(null);
    const [row, setRow] = useState(null);
    const resourceActionPostfix = "вагон в плане состава";

    const fetch = () => {
        setQuery({...query});
    }

    const resource = useResource('trainWagonsPlanWagons');
    const wagonsResource = useResource('wagons');
    const [wagons, setWagons] = useState([]);

    // Load wagons for dropdown
    useEffect(() => {
        const loadWagons = async () => {
            try {
                const wagonsRes = await wagonsResource.search({ paging: { skip: 0 } });
                setWagons(wagonsRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        loadWagons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle data changes
    useEffect(() => {
        if (onDataChange && data) {
            onDataChange();
        }
    }, [data]);
    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('trainWagonsPlanWagons')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode={isFilter === false ? "none" : "default"}
                sortMode={isSort === false ? "none" : "default"}
                leftActions={true}
                enableCellEditOnDoubleClick={false}
                fullHeight={fullHeight}
                onChange={async (e) => {
                    const wrappedRow = e.target;
                    const r = wrappedRow?.row || {};

                    // Handle new row creation - set planId from current filter
                    if (e.type === dataTableEventTypeIds.newRow && defaultQuery?.filter?.planId?.operand1) {
                        r.planId = defaultQuery.filter.planId.operand1;
                        wrappedRow.row = r;
                    }

                    // Handle existing row updates
                    r.planId = r.planId ?? (r.plan?.id ?? r.plan);
                    r.wagonId = r.wagonId ?? (r.wagon?.id ?? r.wagon);
                }}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    { key: 'number', title: 'Number', isSortable: true, editable: true, type: viewTypeIds.text },
                    ...(defaultQuery?.filter?.planId ? [] : [{ key: 'plan', title: 'Plan', isSortable: true, render: (value) => value?.name }]),
                    {
                        key: 'wagon',
                        title: 'Wagon',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: wagons,
                            relationMemberName: 'wagonId',
                            props: { mode: 'portal', labelMemberFunc: (item) => item.type?.shortName || '', valueMemberName: 'id' }
                        },
                        render: (value) => value ? `${value.type?.shortName || ''} - ${value.seatCount || ''}` : ''
                    },
                    {
                        key: 'wagon.type.shortName',
                        title: 'Тип вагона (краткое)',
                        isSortable: true,
                        render: (value, wrappedRow) => {
                            return wrappedRow?.row?.wagon?.type?.shortName || '';
                        }
                    },
                    {
                        key: 'wagon.type.name',
                        title: 'Тип вагона',
                        isSortable: true,
                        render: (value, wrappedRow) => wrappedRow?.row?.wagon?.type?.name || ''
                    },
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
                    },
                    {
                        title: 'Number',
                        key: 'number',
                        operator: 'like',
                    },
                    {
                        title: 'PlanId',
                        key: 'planId',
                    },
                    {
                        title: 'WagonId',
                        key: 'wagonId',
                        renderField: (fieldProps) => <WagonLookup resource={wagonsResource} {...fieldProps} />,
                    },
                ]}
            />
        </>
    )
}
