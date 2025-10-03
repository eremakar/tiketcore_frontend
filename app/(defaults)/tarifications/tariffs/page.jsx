'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useState, useEffect } from "react";
import BaseFareLookup from "@/app/(defaults)/tarifications/baseFares/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import IconSettings from "@/components/icon/icon-settings";
import IconX from "@/components/icon/icon-x";
import TariffTrainCategoryItems from "@/app/(defaults)/tarifications/tariffTrainCategoryItems/page";
import TariffWagonTypeItems from "@/app/(defaults)/tarifications/tariffWagonTypeItems/page";
import TariffWagonItems from "@/app/(defaults)/tarifications/tariffWagonItems/page";

export default function Tariffs() {
    const [query, setQuery] = useState({
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
    const resourceActionPostfix = "тариф";

    const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
    const [selectedTariffId, setSelectedTariffId] = useState(null);

    // Queries for drawer tables
    const [tariffTrainCategoryItemsQuery, setTariffTrainCategoryItemsQuery] = useState(null);
    const [tariffWagonTypeItemsQuery, setTariffWagonTypeItemsQuery] = useState(null);
    const [tariffWagonItemsQuery, setTariffWagonItemsQuery] = useState(null);
    
    // Default data for drawer tables
    const [trainCategoryItemsDefaultData, setTrainCategoryItemsDefaultData] = useState(null);
    const [wagonTypeItemsDefaultData, setWagonTypeItemsDefaultData] = useState(null);
    const [wagonItemsDefaultData, setWagonItemsDefaultData] = useState(null);

    const fetch = () => {
        setQuery({...query});
    }

    const resource = useResource('tariffs');
    const baseFaresResource = useResource('baseFares');
    const trainCategoriesResource = useResource('trainCategories');
    const tariffsResource = useResource('tariffs');
    const wagonTypesResource = useResource('wagonTypes');
    const wagonsResource = useResource('wagonModels');
    const tariffWagonItemsResource = useResource('tariffWagonItems');

    const [baseFares, setBaseFares] = useState([]);
    const [trainCategories, setTrainCategories] = useState([]);
    const [tariffs, setTariffs] = useState([]);
    const [wagonTypes, setWagonTypes] = useState([]);
    const [wagons, setWagons] = useState([]);
    const [tariffWagonItems, setTariffWagonItems] = useState([]);
    const [filteredTariffWagonItems, setFilteredTariffWagonItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [
                baseFaresResponse,
                trainCategoriesResponse,
                tariffsResponse,
                wagonTypesResponse,
                wagonsResponse,
                tariffWagonItemsResponse
            ] = await Promise.all([
                baseFaresResource.search({ paging: { skip: 0, take: 1000 } }),
                trainCategoriesResource.search({ paging: { skip: 0, take: 1000 } }),
                tariffsResource.search({ paging: { skip: 0, take: 1000 } }),
                wagonTypesResource.search({ paging: { skip: 0, take: 1000 } }),
                wagonsResource.search({ paging: { skip: 0, take: 1000 } }),
                tariffWagonItemsResource.search({ paging: { skip: 0, take: 1000 } }),
            ]);
            setBaseFares(baseFaresResponse?.result || []);
            setTrainCategories(trainCategoriesResponse?.result || []);
            setTariffs(tariffsResponse?.result || []);
            setWagonTypes(wagonTypesResponse?.result || []);
            setWagons(wagonsResponse?.result || []);
            setTariffWagonItems(tariffWagonItemsResponse?.result || []);
        };
        fetchData();
    }, []);

    const refreshTariffWagonItems = async () => {
        if (!selectedTariffId) return;
        const response = await tariffWagonItemsResource.search({ 
            paging: { skip: 0, take: 1000 },
            filter: { tariffId: { operand1: selectedTariffId, operator: 'equals' } }
        });
        const filtered = response?.result || [];
        setFilteredTariffWagonItems(filtered);
    };

    const openSettingsDrawer = async (tariffId) => {
        setSelectedTariffId(tariffId);
        setTariffTrainCategoryItemsQuery({
            paging: { skip: 0, take: 10 },
            filter: { tariffId: { operand1: tariffId, operator: 'equals' } },
            sort: { id: { operator: 'desc' } }
        });
        setTariffWagonTypeItemsQuery({
            paging: { skip: 0, take: 10 },
            filter: { tariffId: { operand1: tariffId, operator: 'equals' } },
            sort: { id: { operator: 'desc' } }
        });
        setTariffWagonItemsQuery({
            paging: { skip: 0, take: 10 },
            filter: { tariffId: { operand1: tariffId, operator: 'equals' } },
            sort: { id: { operator: 'desc' } }
        });
        
        // Filter tariffWagonItems for current tariff
        const filtered = tariffWagonItems.filter(item => item.tariffId === tariffId);
        setFilteredTariffWagonItems(filtered);
        
        // Set default data objects
        setTrainCategoryItemsDefaultData({ trainCategories, tariffs });
        setWagonTypeItemsDefaultData({ wagonTypes, tariffs });
        setWagonItemsDefaultData({ wagons, tariffs });
        
        setIsSettingsDrawerOpen(true);
    };
    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('tariffs')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode="default"
                sortMode="default"
                leftActions={true}
                columns={[
                    { key: 'id', title: 'Ид', isSortable: true },
                    { key: 'name', title: 'Name', isSortable: true, editable: true, type: viewTypeIds.text },
                    { key: 'vat', title: 'VAT', isSortable: true, editable: true, type: viewTypeIds.float, decimalPlaces: 2, render: (value) => value ? `${value}%` : '' },
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
                        key: 'trainCategories',
                        title: 'TrainCategories',
                        isSortable: false,
                        render: (value) => value?.length || 0
                    },
                    {
                        key: 'wagons',
                        title: 'Wagons',
                        isSortable: false,
                        render: (value) => value?.length || 0
                    },
                    {
                        key: 'wagonTypes',
                        title: 'WagonTypes',
                        isSortable: false,
                        render: (value) => value?.length || 0
                    },
                    {
                        key: 'settings',
                        title: 'Параметры',
                        isSortable: false,
                        type: viewTypeIds.control,
                        style: { width: '120px' },
                        render: (value, wrappedRow) => (
                            <button
                                className="btn btn-sm btn-gradient prevent"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    openSettingsDrawer(wrappedRow?.row?.id); 
                                }}
                                title="Параметры тарифа"
                            >
                                <IconSettings className="w-5 h-5" />
                            </button>
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
                        title: 'VAT',
                        key: 'vAT',
                        type: 'number',
                    },
                    {
                        title: 'BaseFareId',
                        key: 'baseFareId',
                        renderField: (fieldProps) => <BaseFareLookup resource={baseFaresResource} {...fieldProps} />,
                    },
                ]}
            />

            {/* Right Drawer for Tariff Settings */}
            <div className={`fixed inset-0 z-50 ${isSettingsDrawerOpen ? '' : 'pointer-events-none'}`}>
                <div
                    className={`absolute inset-0 bg-black/50 transition-opacity ${isSettingsDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsSettingsDrawerOpen(false)}
                ></div>
                <div
                    className={`absolute right-0 top-0 h-full w-full max-w-[95vw] bg-white shadow-xl transform transition-transform ${isSettingsDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-to-r from-[#EF1262] to-[#4361EE]">
                        <h3 className="text-lg font-semibold text-white">Параметры тарифа: {tariffs.find(t => t.id === selectedTariffId)?.name || selectedTariffId}</h3>
                        <button 
                            className="btn btn-sm bg-white/20 hover:bg-white/30 text-white border-0 prevent" 
                            onClick={() => setIsSettingsDrawerOpen(false)} 
                            title="Закрыть"
                        >
                            <IconX />
                        </button>
                    </div>
                    <div className="h-[calc(100%-60px)] overflow-auto p-4">
                        {!selectedTariffId && (
                            <p className="text-gray-500 text-sm">Выберите тариф для просмотра параметров</p>
                        )}
                        {selectedTariffId && (
                            <div className="grid grid-cols-2 gap-4">
                                {/* Train Category Items Table */}
                                <div className="border border-gray-300 rounded-md p-3">
                                    <h4 className="text-md font-semibold mb-3">Параметры категорий поездов</h4>
                                    {tariffTrainCategoryItemsQuery?.filter?.tariffId && trainCategoryItemsDefaultData && (
                                        <TariffTrainCategoryItems 
                                            defaultQuery={tariffTrainCategoryItemsQuery}
                                            hideFilters={true}
                                            defaultData={trainCategoryItemsDefaultData}
                                        />
                                    )}
                                </div>

                                {/* Wagon Type Items Table */}
                                <div className="border border-gray-300 rounded-md p-3">
                                    <h4 className="text-md font-semibold mb-3">Параметры типов вагонов</h4>
                                    {tariffWagonTypeItemsQuery?.filter?.tariffId && wagonTypeItemsDefaultData && (
                                        <TariffWagonTypeItems 
                                            defaultQuery={tariffWagonTypeItemsQuery}
                                            hideFilters={true}
                                            defaultData={wagonTypeItemsDefaultData}
                                        />
                                    )}
                                </div>

                                {/* Wagon Items Table */}
                                <div className="border border-gray-300 rounded-md p-3">
                                    <h4 className="text-md font-semibold mb-3">Параметры вагонов</h4>
                                    {tariffWagonItemsQuery?.filter?.tariffId && wagonItemsDefaultData && (
                                        <TariffWagonItems 
                                            defaultQuery={tariffWagonItemsQuery}
                                            hideFilters={true}
                                            defaultData={wagonItemsDefaultData}
                                            onDataChange={refreshTariffWagonItems}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
