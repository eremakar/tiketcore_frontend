'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import TrainCategoryLookup from "@/app/(defaults)/tarifications/trainCategories/lookup";
import TariffLookup from "@/app/(defaults)/tarifications/tariffs/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";

export default function TariffTrainCategoryItems({ defaultQuery, hideFilters = false, defaultData }) {
    const [query, setQuery] = useState(defaultQuery || {
        paging: { skip: 0, take: 100 },
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
    const resourceActionPostfix = "элемент тарифа категории поезда";

    const fetch = () => {
        setQuery({...query});
    }

    const trainCategoriesResource = useResource('trainCategories');
    const tariffsResource = useResource('tariffs');

    const [trainCategories, setTrainCategories] = useState(defaultData?.trainCategories || []);
    const [tariffs, setTariffs] = useState(defaultData?.tariffs || []);
    
    const hasTariffIdFilter = !!query?.filter?.tariffId;

    useEffect(() => {
        if (defaultData?.trainCategories && defaultData?.tariffs) {
            setTrainCategories(defaultData.trainCategories);
            setTariffs(defaultData.tariffs);
            return;
        }
        const fetchData = async () => {
            const trainCategoriesResponse = await trainCategoriesResource.search({ paging: { skip: 0, take: 10000 } });
            setTrainCategories(trainCategoriesResponse.result || []);

            const tariffsResponse = await tariffsResource.search({ paging: { skip: 0, take: 10000 } });
            setTariffs(tariffsResponse.result || []);
        };
        fetchData();
    }, [defaultData]);

    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('tariffTrainCategoryItems')}
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
                        key: 'trainCategory',
                        title: 'TrainCategory',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: trainCategories,
                            relationMemberName: 'trainCategoryId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
                    { key: 'indexCoefficient', title: 'IndexCoefficient', isSortable: true, editable: true, type: viewTypeIds.float, decimalPlaces: 3 },
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
                        title: 'TrainCategoryId',
                        key: 'trainCategoryId',
                        renderField: (fieldProps) => <TrainCategoryLookup resource={trainCategoriesResource} {...fieldProps} />,
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
