'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import TariffLookup from "@/app/(defaults)/tarifications/tariffs/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";

export default function TariffWagonTypeItems({ defaultQuery, hideFilters = false, defaultData }) {
    const [query, setQuery] = useState(defaultQuery || {
        paging: { skip: 0, take: 10 },
        filter: {},
        sort: {
            id: {
                operator: 'desc'
            }
        }
    });

    const [data, setData] = useState([]);
    const resourceActionPostfix = "элемент тарифа типа вагона";

    const wagonTypesResource = useResource('wagonTypes');
    const tariffsResource = useResource('tariffs');

    const [wagonTypes, setWagonTypes] = useState(defaultData?.wagonTypes || []);
    const [tariffs, setTariffs] = useState(defaultData?.tariffs || []);
    
    const hasTariffIdFilter = !!query?.filter?.tariffId;

    useEffect(() => {
        if (defaultData?.wagonTypes && defaultData?.tariffs) {
            setWagonTypes(defaultData.wagonTypes);
            setTariffs(defaultData.tariffs);
            return;
        }
        const fetchData = async () => {
            const [wagonTypesResponse, tariffsResponse] = await Promise.all([
                wagonTypesResource.search({ paging: { skip: 0, take: 1000 } }),
                tariffsResource.search({ paging: { skip: 0, take: 1000 } })
            ]);
            setWagonTypes(wagonTypesResponse?.result || []);
            setTariffs(tariffsResponse?.result || []);
        };
        fetchData();
    }, [defaultData]);

    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('tariffWagonTypeItems')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode={hideFilters ? "none" : "default"}
                sortMode={hideFilters ? "none" : "default"}
                leftActions={true}
                onChange={async (e) => {
                    const { type, target } = e;
                    if (type === dataTableEventTypeIds.newRow) {
                        const tariffId = query?.filter?.tariffId?.operand1;
                        if (tariffId) {
                            target.row.tariffId = tariffId;
                        }
                    }
                }}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    {
                        key: 'wagonType',
                        title: 'WagonType',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: wagonTypes,
                            relationMemberName: 'wagonTypeId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
                    { key: 'indexCoefficient', title: 'IndexCoefficient', isSortable: true, editable: true, type: viewTypeIds.float },
                    ...(!hasTariffIdFilter ? [{
                        key: 'tariff',
                        title: 'Tariff',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: tariffs,
                            relationMemberName: 'tariffId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    }] : []),
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
                    },
                    {
                        title: 'IndexCoefficient',
                        key: 'indexCoefficient',
                        type: 'number',
                    },
                    {
                        title: 'WagonTypeId',
                        key: 'wagonTypeId',
                    },
                    {
                        title: 'TariffId',
                        key: 'tariffId',
                        renderField: (fieldProps) => <TariffLookup resource={tariffsResource} {...fieldProps} />,
                    },
                ]}
            />
        </>
    )
}
