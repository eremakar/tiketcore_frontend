'use client';

import ResourceTable2 from "@/components/genA/v2/resourceTable";
import useResource from "@/hooks/useResource";
import { useState } from "react";
import { viewTypeIds } from "@/components/genA/v2/viewTypeIds";
import Link from "next/link";
import IconCalendar from "@/components/icon/icon-calendar";

export default function TrainSchedules() {
    const [trainsQuery, setTrainsQuery] = useState({
        paging: { skip: 0, take: 10 },
        filter: {},
        sort: {
            id: {
                operator: 'desc'
            }
        }
    });

    const [trainsData, setTrainsData] = useState(null);

    return (
        <div className="p-4 flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4">Поезда</h2>
            <div className="flex-1">
                <ResourceTable2
                    data={trainsData}
                    setData={setTrainsData}
                    useResource={() => useResource('trains')}
                    resourceName="поезд"
                    query={trainsQuery}
                    setQuery={setTrainsQuery}
                    filterMode="default"
                    sortMode="default"
                    leftActions={false}
                    enableCellEditOnDoubleClick={false}
                    fullHeight={true}
                    columns={[
                        { key: 'id', title: 'Ид', isSortable: true, style: { width: '60px' } },
                        { key: 'name', title: 'Название', isSortable: true, editable: true, type: viewTypeIds.text },
                        { key: 'number', title: 'Номер', isSortable: true, editable: true, type: viewTypeIds.text },
                        {
                            key: 'schedules',
                            title: '',
                            type: viewTypeIds.control,
                            style: { width: '1%', whiteSpace: 'nowrap' },
                            render: (value, wrappedRow) => (
                                <Link
                                    href={`/trainSchedules/${wrappedRow?.row?.id}`}
                                    className="btn btn-sm btn-xsm prevent"
                                    title="Расписания"
                                >
                                    <IconCalendar />
                                </Link>
                            )
                        }
                    ]}
                    filters={[
                        { title: 'Ид', key: 'id' },
                        { title: 'Название', key: 'name', operator: 'like' },
                        { title: 'Номер', key: 'number', operator: 'like' },
                    ]}
                />
            </div>
        </div>
    );
}


