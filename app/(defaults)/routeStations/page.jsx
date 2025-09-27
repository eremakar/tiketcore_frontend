'use client';

import ResourceTable from "@/components/genA/resourceTable";
import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useEffect, useState } from "react";
import { formatDateOnlyTime, formatDurationFromEpoch } from "@/components/genA/functions/datetime";
import StationLookup from "@/app/(defaults)/stations/lookup";
import RailwayStationLookup from "@/app/(defaults)/railwayStations/lookup";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import Details2 from "@/components/genA/details2";
import { ResourceSelect2 } from "@/components/genA/resourceSelect2";
import { dataTableEventTypeIds } from "@/components/genA/v2/dataTableEventTypeIds";

export default function RouteStations({ defaultQuery = null, fullHeight = false, onDataChange = null, hideFilters = false, ...props }) {
    const [query, setQuery] = useState(defaultQuery || {
        paging: { skip: 0, take: 100 },
        filter: {},
        sort: {
            routeId: { operator: 'asc' },
            order: { operator: 'asc' }
        }
    });

    const [createShow, setCreateShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [detailsShow, setDetailsShow] = useState(false);

    const [data, setData] = useState(null);
    const [row, setRow] = useState(null);
    const resourceActionPostfix = "станция маршрута";

    const fetch = () => {
        setQuery({...query});
    }

    const stationsResource = useResource('stations');
    const railwayStationsResource = useResource('railwayStations');
    const routeStationsResource = useResource('routeStations');
    const routesResource = useResource('routes');
    const railwaiesResource = useResource('railwaies');
    const [stations, setStations] = useState([]);
    const [routes, setRoutes] = useState([]);

    const [addStationsShow, setAddStationsShow] = useState(false);
    const [selectedRailwayId, setSelectedRailwayId] = useState(null);
    const [addQuery, setAddQuery] = useState({
        paging: { skip: 0, take: 100 },
        filter: {},
        sort: { id: { operator: 'asc' } }
    });
    const [selectedStations, setSelectedStations] = useState([]);
    const [modalPageRows, setModalPageRows] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [stRes, rtRes] = await Promise.all([
                    stationsResource.search({ paging: { skip: 0 } }),
                    routesResource.search({ paging: { skip: 0 } })
                ]);
                setStations(stRes?.result || []);
                setRoutes(rtRes?.result || []);
            } catch (e) {
                console.error(e);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update query when defaultQuery changes
    useEffect(() => {
        if (defaultQuery) {
            setQuery(defaultQuery);
        }
    }, [defaultQuery]);

    // Check if routeId is filtered in query
    const isRouteFiltered = query?.filter?.routeId || defaultQuery?.filter?.routeId;
    const currentRouteId = (query?.filter?.routeId && (query.filter.routeId.operand1 ?? query.filter.routeId))
        || (defaultQuery?.filter?.routeId && (defaultQuery.filter.routeId.operand1 ?? defaultQuery.filter.routeId))
        || null;

    const toggleSelectedStation = (row) => {
        const exists = selectedStations.find(_ => _.id === row.id);
        if (exists) {
            setSelectedStations(selectedStations.filter(_ => _.id !== row.id));
        } else {
            setSelectedStations([...selectedStations, row]);
        }
    };

    const handleCreateStations = async () => {
        if (!currentRouteId || selectedStations.length === 0) {
            setAddStationsShow(false);
            return;
        }
        try {
            let i = 0;
            const payload = selectedStations.map(st => ({
                order: ++i,
                routeId: currentRouteId,
                stationId: st.stationId ?? st?.station?.id
            }));

            await routeStationsResource.post('/bulk', payload);

            setAddStationsShow(false);
            setSelectedStations([]);
            setSelectedRailwayId(null);
            setAddQuery({ ...addQuery });
            // refresh table
            setQuery({ ...query });
            if (onDataChange) onDataChange();
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <>
            <ResourceTable2
                data={data}
                setData={setData}
                useResource={() => useResource('routeStations')}
                resourceName={resourceActionPostfix}
                query={query}
                setQuery={setQuery}
                filterMode={hideFilters ? "none" : "default"}
                sortMode={hideFilters ? "none" : "default"}
                leftActions={true}
                enableCellEditOnDoubleClick={false}
                fullHeight={fullHeight}
                renderAdvancedActions={() => isRouteFiltered ? (
                    <button type="button" className="btn btn-primary" onClick={() => setAddStationsShow(true)}>Добавить станции</button>
                ) : null}
                onChange={async (e) => {
                    const wrappedRow = e.target;
                    const r = wrappedRow?.row || {};

                    // Handle new row creation - set routeId from current filter
                    if (e.type === dataTableEventTypeIds.newRow && currentRouteId) {
                        r.routeId = currentRouteId;
                        wrappedRow.row = r;
                    }

                    // Handle existing row updates
                    r.routeId = r.routeId ?? (r.route?.id ?? r.route);
                    r.stationId = r.stationId ?? (r.station?.id ?? r.station);
                    if ('route' in r) delete r.route;
                    if ('station' in r) delete r.station;

                    // Notify parent component about data changes only when saving
                    if (e.type === dataTableEventTypeIds.commitRow && onDataChange) {
                        onDataChange();
                    }
                }}
                columns={[
                    ...(isRouteFiltered ? [] : [{ key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } }]),
                    ...(isRouteFiltered ? [] : [{
                        key: 'route',
                        title: 'Маршрут',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.select,
                        options: {
                            items: routes,
                            relationMemberName: 'routeId',
                            props: { mode: 'portal', labelMemberName: 'name', valueMemberName: 'id' }
                        },
                        render: (value, wrappedRow) => {
                            return value?.name;
                        }
                    }]),
                    {
                        key: 'order',
                        title: 'Порядок следования',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.int,
                        style: { minWidth: '100px' }
                    },
                    {
                        key: 'station',
                        title: 'Станция',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.control,
                        render: (value, row, onChange, data, isEdit) => {
                            const stationId = row?.stationId;
                            return !isEdit ? value?.name : <RailwayStationLookup resource={railwayStationsResource} name="station" label="Станция" onRowChange={(_) => {
                                row.stationId = _.stationId;
                                onChange(row);
                            }} value={row?.id} formatValue={_ => _?.station?.name} />;
                        }
                    },
                    {
                        key: 'stationCode',
                        title: 'Код станции',
                        isSortable: true,
                        render: (value, wrappedRow) => {
                            return wrappedRow?.row?.station?.code;
                        }
                    },
                    {
                        key: 'arrival',
                        title: 'Время прибытия',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.time,
                        options: {
                            nullable: true,
                        }
                        //render: (value) => formatDateOnlyTime(value)
                    },
                    {
                        key: 'stop',
                        title: 'Остановка',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.time,
                        options: {
                            nullable: true,
                        }
                        //render: (value) => formatDateOnlyTime(value)
                    },
                    {
                        key: 'departure',
                        title: 'Время отправления',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.time,
                        options: {
                            nullable: true,
                        }
                        //render: (value) => formatDateOnlyTime(value)
                    },
                    {
                        key: 'distance',
                        title: 'Расстояние',
                        isSortable: true,
                        editable: true,
                        type: viewTypeIds.number,
                        options: {
                            nullable: true,
                            step: 0.01
                        }
                    },
                ]}
                filters={[
                    {
                        title: 'Ид',
                        key: 'id',
                    },
                    {
                        title: 'Порядок следования',
                        key: 'order',
                        type: 'number',
                    },
                    {
                        title: 'Время прибытия',
                        key: 'arrival',
                        type: 'datetime',
                    },
                    {
                        title: 'Остановка',
                        key: 'stop',
                        type: 'datetime',
                    },
                    {
                        title: 'Время отправления',
                        key: 'departure',
                        type: 'datetime',
                    },
                    {
                        title: 'Расстояние',
                        key: 'distance',
                        type: 'number',
                    },
                    {
                        title: 'StationId',
                        key: 'stationId',
                        renderField: (fieldProps) => <StationLookup resource={stationsResource} {...fieldProps} />,
                    },
                    {
                        title: 'RouteId',
                        key: 'routeId',
                    },
                ]}
                {...props}
            />
            <Details2 show={addStationsShow} setShow={setAddStationsShow} resourceName="станции"
                title="Добавить станции"
                renderButtons={() => (
                    <>
                        <button className="btn btn-success" onClick={handleCreateStations}>Создать</button>
                    </>
                )}
            >
                <div className="panel flex" style={{flexDirection:'column', gap:'10px'}}>
                    <div>
                        <ResourceSelect2
                            resource={railwaiesResource}
                            value={selectedRailwayId}
                            onChange={(v) => {
                                const id = typeof v === 'object' ? v?.id : v;
                                setSelectedRailwayId(id);
                                const filter = id ? { railwayId: { operand1: id, operator: 'equals' } } : {};
                                setAddQuery({ ...addQuery, filter });
                            }}
                            placeholder="Выберите железную дорогу"
                            valueMemberName="id"
                            labelMemberName="name"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => {
                            const map = new Map();
                            selectedStations.forEach(r => map.set(r.id, r));
                            modalPageRows.forEach(r => map.set(r.id, r));
                            setSelectedStations(Array.from(map.values()));
                        }}>Выбрать все</button>
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => {
                            const ids = new Set(modalPageRows.map(r => r.id));
                            setSelectedStations(selectedStations.filter(r => !ids.has(r.id)));
                        }}>Снять со всех</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
                            setAddQuery({ ...addQuery, sort: { id: { operator: 'asc' } } });
                        }}>Порядок вверх</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => {
                            setAddQuery({ ...addQuery, sort: { id: { operator: 'desc' } } });
                        }}>Порядок вниз</button>
                    </div>
                    <ResourceTable
                        useResource={() => useResource('railwayStations')}
                        query={addQuery}
                        setQuery={setAddQuery}
                        setPage={setModalPageRows}
                        renderHeader={() => <></>}
                        sorts={[]}
                        columns={[
                            { key: 'select', title: '', render: (value, row) => {
                                const checked = !!selectedStations.find(_ => _.id === row.id);
                                return <input type="checkbox" className="form-checkbox" checked={checked} onChange={() => toggleSelectedStation(row)} />;
                            }},
                            { key: 'id', title: 'Ид', isSortable: true },
                            { key: 'station', title: 'Станция', isSortable: true, render: (value) => value?.name },
                            { key: 'stationCode', title: 'Код станции', isSortable: true, render: (value, row) => row?.station?.code },
                            { key: 'railway', title: 'ЖД', isSortable: true, render: (value) => value?.name },
                        ]}
                        filters={[
                            { title: 'Ид', key: 'id' },
                            { title: 'RailwayId', key: 'railwayId' },
                        ]}
                        actions={{
                            onSelect: (row) => toggleSelectedStation(row)
                        }}
                        isPager={true}
                        filterMode="popup"
                    />
                </div>
            </Details2>
        </>
    )
}
