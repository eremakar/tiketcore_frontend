'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import useTarificationsResource from "@/hooks/useTarificationsResource";
import { useState, useEffect } from "react";
import TrainLookup from "@/app/(defaults)/trains/lookup";
import BaseFareLookup from "@/app/(defaults)/tarifications/baseFares/lookup";
import TrainCategoryLookup from "@/app/(defaults)/tarifications/trainCategories/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import IconLayoutGrid from "@/components/icon/icon-layout-grid";
import IconX from "@/components/icon/icon-x";
import IconCpuBolt from "@/components/icon/icon-cpu-bolt";
import SeatTariffItems from "@/app/(defaults)/tarifications/seatTariffItems/page";

export default function SeatTariffs() {
    const [query, setQuery] = useState({
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
    const resourceActionPostfix = "тариф места в вагоне";

    const fetch = () => {
        setQuery({...query});
    }

    const resource = useResource('seatTariffs');
    const trainsResource = useResource('trains');
    const baseFaresResource = useResource('baseFares');
    const trainCategoriesResource = useResource('trainCategories');
    const tariffsResource = useResource('tariffs');
    const seatTariffsResource = useTarificationsResource('seatTariffs');

    const [trains, setTrains] = useState([]);
    const [baseFares, setBaseFares] = useState([]);
    const [trainCategories, setTrainCategories] = useState([]);
    const [tariffs, setTariffs] = useState([]);

    const [isTariffItemsDrawerOpen, setIsTariffItemsDrawerOpen] = useState(false);
    const [selectedTariffId, setSelectedTariffId] = useState(null);
    const [tariffItemsQuery, setTariffItemsQuery] = useState({
        paging: { skip: 0, take: 1000 },
        filter: {},
        sort: { id: { operator: 'desc' } }
    });

    useEffect(() => {
        const fetchData = async () => {
            const trainsResponse = await trainsResource.search({ paging: { skip: 0, take: 10000 } });
            setTrains(trainsResponse.result || []);

            const baseFaresResponse = await baseFaresResource.search({ paging: { skip: 0, take: 10000 } });
            setBaseFares(baseFaresResponse.result || []);

            const trainCategoriesResponse = await trainCategoriesResource.search({ paging: { skip: 0, take: 10000 } });
            setTrainCategories(trainCategoriesResponse.result || []);

            const tariffsResponse = await tariffsResource.search({ paging: { skip: 0, take: 10000 } });
            setTariffs(tariffsResponse.result || []);
        };
        fetchData();
    }, []);

    const openTariffItemsDrawer = (wrappedRow) => {
        const tariffId = wrappedRow.row.id;
        setSelectedTariffId(tariffId);
        setTariffItemsQuery({
            paging: { skip: 0, take: 1000 },
            filter: { seatTariffId: { operand1: tariffId, operator: 'equals' } },
            sort: { id: { operator: 'desc' } }
        });
        setIsTariffItemsDrawerOpen(true);
    };

    const calculateTariffItems = async (wrappedRow) => {
        const tariffId = wrappedRow.row.id;
        try {
            const response = await seatTariffsResource.post(`/${tariffId}/items/calculate`);
            
            if (response) {
                alert('Цены по станциям успешно сгенерированы!');
                // Обновляем таблицу
                setQuery({...query});
            } else {
                alert('Ошибка при генерации цен');
            }
        } catch (error) {
            console.error('Error calculating tariff items:', error);
            alert('Ошибка при генерации цен по станциям');
        }
    };
    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('seatTariffs')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode="default"
                sortMode="default"
                leftActions={true}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    { key: 'name', title: 'Name', isSortable: true, editable: true, type: viewTypeIds.text },
                    {
                        key: 'train',
                        title: 'Train',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: trains,
                            relationMemberName: 'trainId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
                    {
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
                    },
                    {
                        key: 'baseFare',
                        title: 'BaseFare',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: baseFares,
                            relationMemberName: 'baseFareId',
                            primitive: false,
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value) => value?.name
                    },
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
                    {
                        key: 'tariffItems',
                        title: 'Цены по станциям',
                        isSortable: false,
                        type: viewTypeIds.control,
                        style: { width: '160px' },
                        render: (value, wrappedRow) => (
                            <div className="flex space-x-1">
                                <button
                                    className="btn btn-sm prevent"
                                    onClick={(e) => { e.stopPropagation(); openTariffItemsDrawer(wrappedRow); }}
                                    title="Таблица цен по станциям"
                                >
                                    <IconLayoutGrid />
                                </button>
                                <button
                                    className="btn btn-sm prevent"
                                    onClick={(e) => { e.stopPropagation(); calculateTariffItems(wrappedRow); }}
                                    title="Сгенерировать цены по станциям"
                                >
                                    <IconCpuBolt />
                                </button>
                            </div>
                        )
                    },
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
                    },
                    {
                        title: 'Name',
                        key: 'name',
                        operator: 'like',
                    },
                    {
                        title: 'TrainId',
                        key: 'trainId',
                        renderField: (fieldProps) => <TrainLookup resource={trainsResource} {...fieldProps} />,
                    },
                    {
                        title: 'BaseFareId',
                        key: 'baseFareId',
                        renderField: (fieldProps) => <BaseFareLookup resource={baseFaresResource} {...fieldProps} />,
                    },
                    {
                        title: 'TrainCategoryId',
                        key: 'trainCategoryId',
                        renderField: (fieldProps) => <TrainCategoryLookup resource={trainCategoriesResource} {...fieldProps} />,
                    },
                ]}
            />

            {/* Right Drawer for Tariff Items */}
            <div className={`fixed inset-0 z-50 ${isTariffItemsDrawerOpen ? '' : 'pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity ${isTariffItemsDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsTariffItemsDrawerOpen(false)}
                ></div>
                <div
                    className={`absolute right-0 top-0 h-full w-full max-w-[95vw] bg-white shadow-xl transform transition-transform ${isTariffItemsDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="text-md font-semibold">Цены по станциям</h3>
                        <button className="btn btn-sm prevent" onClick={() => setIsTariffItemsDrawerOpen(false)} title="Закрыть">
                            <IconX />
                        </button>
                    </div>
                    <div className="h-[calc(100%-52px)] overflow-auto p-3">
                        {!selectedTariffId && (
                            <p className="text-gray-500 text-sm">Выберите тариф для просмотра цен по станциям</p>
                        )}
                        {selectedTariffId && (
                            <div className="tariff-items-container w-full">
                                <SeatTariffItems
                                    defaultQuery={tariffItemsQuery}
                                    fullHeight={true}
                                    hideFilters={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
