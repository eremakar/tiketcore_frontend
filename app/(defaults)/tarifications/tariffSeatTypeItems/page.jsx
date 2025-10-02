'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import SeatTypeLookup from "@/app/(defaults)/seatTypes/lookup";
import TariffWagonItemLookup from "@/app/(defaults)/tarifications/tariffWagonItems/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";

export default function TariffSeatTypeItems({ defaultQuery, hideFilters = false, defaultData }) {
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

    const [row, setRow] = useState(null);
    const [data, setData] = useState([]);
    const resourceActionPostfix = "элемент тарифа типа места";

    const fetch = () => {
        setQuery({...query});
    }

    const seatTypesResource = useResource('seatTypes');
    const tariffWagonItemsResource = useResource('tariffWagonItems');

    const [seatTypes, setSeatTypes] = useState(defaultData?.seatTypes || []);
    const [tariffWagonItems, setTariffWagonItems] = useState(defaultData?.tariffWagonItems || []);
    
    const hasTariffWagonIdFilter = !!query?.filter?.tariffWagonId;

    useEffect(() => {
        if (defaultData?.seatTypes) {
            setSeatTypes(defaultData.seatTypes);
        }
        if (defaultData?.tariffWagonItems) {
            setTariffWagonItems(defaultData.tariffWagonItems);
        }
        if (defaultData?.seatTypes && defaultData?.tariffWagonItems) {
            return;
        }
        const fetchData = async () => {
            if (!defaultData?.seatTypes) {
                const seatTypesResponse = await seatTypesResource.search({ paging: { skip: 0, take: 1000 } });
                setSeatTypes(seatTypesResponse.result || []);
            }

            if (!defaultData?.tariffWagonItems) {
                const tariffWagonItemsResponse = await tariffWagonItemsResource.search({ paging: { skip: 0, take: 1000 } });
                setTariffWagonItems(tariffWagonItemsResponse.result || []);
            }
        };
        fetchData();
    }, [defaultData]);

    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('tariffSeatTypeItems')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode={hideFilters ? "none" : "default"}
                sortMode={hideFilters ? "none" : "default"}
                leftActions={true}
                onChange={async (e) => {
                    const { type, target } = e;
                    if (type === dataTableEventTypeIds.newRow) {
                        const tariffWagonId = query?.filter?.tariffWagonId?.operand1;
                        if (tariffWagonId) {
                            target.row.tariffWagonId = tariffWagonId;
                        }
                    }
                }}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    {
                        key: 'seatType',
                        title: 'SeatType',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: seatTypes,
                            relationMemberName: 'seatTypeId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
                    { key: 'indexCoefficient', title: 'IndexCoefficient', isSortable: true, editable: true, type: viewTypeIds.float, decimalPlaces: 3 },
                    ...(!hasTariffWagonIdFilter ? [{
                        key: 'tariffWagon',
                        title: 'TariffWagon',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: tariffWagonItems,
                            relationMemberName: 'tariffWagonId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberFunc: (item) => `${item.wagon?.name || ''} (${item.indexCoefficient || 0})`, valueMemberName: 'id' }
                        },
                        render: (value) => `${value?.wagon?.name || ''} (${value?.indexCoefficient || 0})`
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
                        title: 'SeatTypeId',
                        key: 'seatTypeId',
                        renderField: (fieldProps) => <SeatTypeLookup resource={seatTypesResource} {...fieldProps} />,
                    },
                    {
                        title: 'TariffWagonId',
                        key: 'tariffWagonId',
                        renderField: (fieldProps) => <TariffWagonItemLookup resource={tariffWagonItemsResource} {...fieldProps} />,
                    },
                ]}
            />
        </>
    )
}
