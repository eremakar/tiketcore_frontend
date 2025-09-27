'use client';

//import { Metadata } from 'next';
import React, { useEffect, useState } from 'react';
import { Field } from '@/components/genA/field';
import Details2 from '@/components/genA/details2';
import ResourceDelete from "@/components/genA/resourceDelete";
import Submit2 from '@/components/genA/submit2';
import Lookup from '@/components/genA/lookup';
import Pagination from "@/components/genA/pagination";
import List from "@/components/genA/list";
import FormField from "@/components/genA/FormField";
import Fields from "@/components/genA/fields";
import Filter from "@/components/genA/filter";
import Sort from "@/components/genA/sort";
import SheetTable from "@/components/genA/sheetTable";
import ResourceTable from "@/components/genA/resourceTable";
import { FormSection } from "@/components/genA/formSection";
import { useRouter } from 'next/navigation';

const GenA = () => {
    const [text, setText] = useState('TEST');
    const [text2, setText2] = useState('TEST');
    const [checked, setChecked] = useState(false);
    const [checkeds, setCheckeds] = useState([]);
    const [date, setDate] = useState(new Date(2025, 0, 1, 0, 0, 0));
    const [date2, setDate2] = useState(new Date(2025, 1, 1, 0, 0, 0));
    const [radio, setRadio] = useState(0);
    const [select, setSelect] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [data, setData] = useState([
        { id: 1, name: 'TEST', nameKz: 'TEST', description: 'TEST', decriptionKz: 'TEST', bin: '123', addressLine: 'TEST', addressLineKz: 'TEST' }
    ]);
    const [query, setQuery] = useState({
        paging: {
          skip: 0,
          take: 10
        },
        filter: {

        },
        sort: {
          id: { operator: 'desc' }
        }
    });
    const columns = [
        { key: 'id', title: 'Ид новый', isSortable: true },
        { key: 'name', title: 'Name', isSortable: true },
        { key: 'nameKz', title: 'NameKz', isSortable: true },
        { key: 'decription', title: 'Decription', isSortable: true },
        { key: 'decriptionKz', title: 'Описание(KZ)', isSortable: true },
        { key: 'bin', title: 'BIN', isSortable: true },
        { key: 'addressLine', title: 'AddressLine', isSortable: true },
        { key: 'addressLineKz', title: 'Адрес(KZ)', isSortable: true }
    ];
    const filters = [
        {
            title: 'Ид',
            key: 'id',
            type: 'number',
        },
        {
            title: 'Name',
            key: 'name',
            operator: 'like',
        },
        {
            title: 'NameKz',
            key: 'nameKz',
            operator: 'like',
        },
        {
            title: 'Decription',
            key: 'decription',
            operator: 'like',
        },
        {
            title: 'Описание (KZ)',
            key: 'decriptionKz',
            operator: 'like',
        },
        {
            title: 'BIN',
            key: 'bIN',
            operator: 'like',
        },
        {
            title: 'Address Line',
            key: 'addressLine',
            operator: 'like',
        },
        {
            title: 'Адрес (KZ)',
            key: 'addressLineKz',
            operator: 'like',
        }
    ];
    const sorts = [
        { key: 'id', title: 'Ид' },
    ];
    const useResource = () => {
        return {
            search: (query) => {
                return {
                    result: data,
                    total: data.length
                }
            }
        }
    }

    return <>
        <Fields cols={2}>

            <Field type="textarea" label="textarea" value={text2} onChange={_ => {
                setText2(_);
            }} />
            <Field type="text" label="text" value={text} onChange={_ => {
                setText(_);
            }} />
            <Field type="checkbox" label="checkbox" value={checked} onChange={_ => {
                setChecked(_);
            }} />
            <Field type="multicheckbox" options={["Вариант 1", "Вариант 2"]} label="checkbox" orientation="horizontal" value={checkeds} onChange={_ => {
                setCheckeds(_);
            }} />
            <Field type="date" label="date" value={date} onChange={_ => {
                setDate(_);
            }} />
            <label>Date: {date?.toISOString()}</label>
            <Field type="datetime" label="datetime" value={date2} onChange={_ => {
                setDate2(_);
            }} />
            <label>Date2: {date2?.toISOString()}</label>
            <Field type="radiogroup" options={["Вариант 1", "Вариант 2"]} label="radiogroup" orientation="horizontal" value={radio} onChange={_ => {
                setRadio(_);
            }} />
            <Field type="select" options={[{ id: 1, name: "Вариант 1" }, { id: 2, name: "Вариант 2" }]} label="select" value={select} onChange={_ => {
                setSelect(_);
            }} />
            <div>
                <Details2 show={showDetails} setShow={setShowDetails} size="lg" render={_ => {
                    return <>Content</>
                }} />
                <button onClick={_ => setShowDetails(true)}>Show details</button>
            </div>
            <Field type="lookup" mode="popover" />
            <Pagination currentPage={1} count={60} rowsPerPage={10} />
            <List data={data} setData={setData} filters={filters} sorts={sorts} />
            <SheetTable data={data} columns={columns} setData={setData} filters={filters} sorts={sorts} />
            <form>
            <Fields cols={3}>
                <FormField label="Label1" orientation="horizontal" type="textarea"  value={text2} onChange={_ => {
                    setText2(_);
                }} />
                <FormField label="Label2" orientation="horizontal" type="textarea"  value={text2} onChange={_ => {
                    setText2(_);
                }} />
                <FormField label="Label3" orientation="horizontal" type="textarea"  value={text2} onChange={_ => {
                    setText2(_);
                }} />
                <FormField label="Label4" orientation="horizontal" type="textarea"  value={text2} onChange={_ => {
                    setText2(_);
                }} />
            </Fields>
            <div>starter page</div>
            </form>
            <div>
                {/* <Filter query={query} setQuery={setQuery} schema={filters} part={1} show={showFilter} setShow={setShowFilter} /> */}
                <Filter query={query} setQuery={setQuery} schema={filters} mode='popup' show={showFilter} setShow={setShowFilter} />
                <FormField label="Label5" orientation="horizontal" type="textarea"  value={text2} onChange={_ => {
                    setText2(_);
                }} />
            </div>
            <div>
                <Sort query={query} setQuery={setQuery} schema={{ sorts }} mode='popup' show={showSort} setShow={setShowSort} />
            </div>
            <div>
                <ResourceDelete useResource={() => {}} show={showDelete} setShow={setShowDelete} actionTitle={"TEST"} submitTitle={"OK"} />
                <button onClick={_ => setShowDelete(true)}>Show delete</button>
            </div>
            <div>
                <Submit2 title="Создание" show={showCreate} setShow={setShowCreate} size="lg">
                    <form>
                        <Fields cols={2}>
                            <FormField label="Field1" type="text" />
                            <FormField label="Field2" type="number" />
                        </Fields>
                    </form>
                </Submit2>
                <button onClick={_ => setShowCreate(true)}>Show create</button>
            </div>
            <div>
                <Submit2 title="Изменение" show={showCreate} setShow={setShowCreate} size="lg">
                    <form>
                        <Fields cols={2}>
                            <FormField label="Field1" type="text" />
                            <FormField label="Field2" type="number" />
                        </Fields>
                    </form>
                </Submit2>
                <button onClick={_ => setShowEdit(true)}>Show edit</button>
            </div>
            <ResourceTable query={query} setQuery={setQuery} useResource={useResource} columns={columns} filters={filters} sorts={sorts}
            actions={{
                onCreate: () => setShowCreate(true),
                onEdit: (row) => {
                    setShowEdit(true);
                },
                onDetails: (row) => {
                    //setDetailsShow(true);
                }
            }}
             />
             <Field type="resourcelookup" useResource={useResource} placeholder="Lookup" options={
                {
                    table: {
                        columns: columns,
                        filters: filters,
                        sorts: sorts,
                        size: 'lg'
                    }
                }
             } />
             {/* <FormSection title="TEST" type="expandable">
                <ResourceTable query={query} setQuery={setQuery} useResource={useResource} columns={columns} filters={filters} sorts={sorts}
                    actions={{
                        onCreate: () => setShowCreate(true),
                        onEdit: (row) => {
                            setShowEdit(true);
                        },
                        onDetails: (row) => {
                            //setDetailsShow(true);
                        }
                    }}
                    />
             </FormSection> */}
        </Fields>
    </>
}
export default GenA;
