// import {Button, Table} from "react-bootstrap";
import List from "./list";
import {clearSort, setSort2, switchSort} from "./functions/query";
import {useState} from "react";
// import styles from "/styles/common.module.scss";
// import { TextField } from "@mui/material";
import { useEffect } from "react";
import IconMinus from '@/components/icon/icon-minus';
import IconEdit from '@/components/icon/icon-edit';
import IconTrash from '@/components/icon/icon-trash';
import IconEye from '@/components/icon/icon-eye';
import { Field } from "./field";
import Tippy from "@tippyjs/react";

const SheetTable = ({data, setData, query, setQuery, onQuery, onMap, columns, view, filters, sorts, renderHeads, renderRows, renderFooters, actions, filterActions, actionsHeadStyle, actionsMap,
    onCalculate, onCalculateCell, renderRowActions, ...props}) => {
    let { sort } = query || { sort: {} };
    sort = sort || {};

    const [calculating, setCalculating] = useState(false);

    const renderHead = (column) => {
        if(column.key === 'addOrRemove'){
            return <Button className="btn btn-sm prevent" onClick={addRow}><i className="fa fa-plus fs-14 prevent"></i></Button>;
        }

        const sortKey = column.sortKey || column.key;
        const sortValue = sort[sortKey];
        const sortOperator = sortValue?.operator;
        const isSortable = (filters || []).find(_ => _.key == sortKey && _.isSortable) || (sorts || []).find(_ => _.key == sortKey);
        return <div className="d-flex">
            {column.renderHead ? column.renderHead(column) : <span>{column.title}</span>}
            {isSortable &&
            <span style={{float:'right'}} onClick={() => setSort(column)}>
                {sortOperator == 'desc' ? <i className="fa fa-angle-down"></i> : <i className="fa fa-angle-down" style={{opacity: 0.4}}></i>}
                {sortOperator == 'asc' ? <i className="fa fa-angle-up"></i> : <i className="fa fa-angle-up" style={{opacity: 0.4}}></i>}
            </span>}
        </div>
    }

    const addRow = ()=>{
        setData([...data, {}])
    }

    const setSort = (column) => {
        const sortKey = column.sortKey || column.key;
        const sortValue = sort[sortKey];

        if (sortValue) {
            switchSort(sort, sortKey);
        } else {
            clearSort(sort);
            setSort2(sort, sortKey, 'desc');
        }

        setQuery({ ...query, sort: { ...sort } });
    }

    const deleteTableRows = (rowIndex)=>{
        let newRows = [...data];
        newRows.splice(rowIndex, 1);
        setData(newRows);
    }

    useEffect(() => {
        if (!data || data.length == 0 || calculating)
            return;
        setCalculating(true);
        onCalculate ? onCalculate(data) : calculate();
        setCalculating(false);
    }, [data, calculating]);

    const calculate = () => {
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            for (let j = 0; j < columns?.length; j++) {
                const column = columns[j];
                const key = column.key;
                onCalculateCell && onCalculateCell(data, i, row, j, column, key);
            }
        }
    }

    const handleCellChange = (row, key, value) => {
        row[key] = value;
    };

    const handleCellStartEditing = (row, key) => {
        if (!row._state)
            row._state = {};
        row._state[key] = 'edit';
        setData && setData([...data]);
    };

    const handleCellEndEditing = (row, key) => {
        if (!row._state)
            row._state = {};
        row._state[key] = 'readonly';

        setData && setData([...data]);
    };

    const renderCell = (row, column, page, data, columnIndex, rowIndex) => {
        const value = row[column.key]

        if(column.key === 'addOrRemove'){
            return <td key={`${row.key}${columnIndex}`}>
                <button type="button" class="btn btn-danger" onClick={() => deleteTableRows(rowIndex)}>
                    <IconMinus />
                </button>
            </td>;
        }
        const changedRow = formattedRow(row);

        const text = (value || "").toString();

        const cellView = column.view || view;

        switch (cellView) {
            case 'edit':
                return <EditableCell
                    key={`${row.key}${columnIndex}`}
                    value={text}
                    onChange={(value) =>
                        handleCellChange(row, column.key, value)
                    }
                    column={column}
                    row={row}
                    page={page}
                    onDoubleClick={(value) => {
                        handleCellStartEditing(row, column.key);
                    }}
                    onBlur={(value) =>
                        handleCellEndEditing(row, column.key)
                    }
                    />
        }

        return <td
            key={`${row.key}${columnIndex}`}
            style={column.style || {}}
        >
            {!column.render ? text : column.render(value, changedRow, page, data)}
        </td>
    }


    const formattedRow = (row) => {
        const roles = [];
        row.roles?.map(e => roles.push(e.roleId));
        return {
            ...row,
            roles: roles
        };
    }

    const renderEditableCell = (column, value, onChange) => {
        const type = column.type || "text";

        switch (type) {
            case "number":
                return <Field
                    style={{minWidth: '100px'}}
                    value={value}
                    size="small"
                    onChange={(e) => onChange(e.target.value)}
                    type={"number"}
                    fullWidth
                    autoFocus
                />
            case "text":
                return <Field
                    style={{minWidth: '100px'}}
                    value={value}
                    size="small"
                    onChange={(e) => {
                        onChange(e.target.value)
                    }}
                    type={"text"}
                    fullWidth
                    autoFocus
                />
            default:
                return <span>`View for ${type} is not defined`</span>
        }
    }

    const EditableCell = ({ value, onChange, column, row, page, onDoubleClick, onBlur }) => {
        const _state = row._state || {};
        const editing = _state[column.key] == 'edit';

        const [text, setText] = useState(value);

        return (
            <td
                style={column.style || {}}
                onDoubleClick={onDoubleClick}
                onBlur={onBlur}
                contentEditable={editing}
                suppressContentEditableWarning
            >
                <>
                    {column.render ?
                    <>
                        {column.render(text, row, page, data, setData, (v) => {
                            setText(v);
                            onChange && onChange(v);
                        }, _state, column.key) || <span>&nbsp;</span>}
                    </> :
                    <>
                        {editing ?
                            renderEditableCell(column, text, (v) => {
                                setText(v);
                                onChange && onChange(v);
                            })
                        :
                            value || <span>&nbsp;</span>
                        }
                    </>
                }
                </>

            </td>
        );
    };

    const renderActions = (row) => {
        let actions = filterActions ? filterActions(row) : ["edit", "delete", "details"];
        actions = actionsMap ? actionsMap : actions;

        return <div className="flex gap-2">
            {actions.find(_ => _ == "edit") && onEdit &&
                <Tippy content="Редактирование">
                <button type="button" className="btn btn-warning btn-sm" onClick={async () => await onEdit(row)}>
                    <IconEdit />
                </button></Tippy>}
            {actions.find(_ => _ == "delete") && onDelete &&
                <Tippy content="Удаление">
                <button type="button" className="btn btn-danger btn-sm" onClick={async () => await onDelete(row)}>
                    <IconTrash />
                </button></Tippy>}
            {actions.find(_ => _ == "details") && onDetails &&
                <Tippy content="Просмотр">
                <button type="button" className="btn btn-info btn-sm" onClick={async () => await onDetails(row)}>
                    <IconEye />
                </button></Tippy>}
            {renderRowActions && renderRowActions(row, actions)}
        </div>
    }

    const { onEdit, onEditPassword, onDelete, onDetails, onSelect } = actions || {};
    const isActions = onEdit || onEditPassword || onDelete || onDetails || renderRowActions;

    return <List data={data} setData={setData} query={query} view={view} setQuery={setQuery} onQuery={onQuery} onMap={onMap} columns={columns} filters={filters} sorts={sorts} actions={actions} {...props}
        render={(data, setData, page, setPage, columns, filters, sorts, props) => {
            return (
                    <div style={{maxHeight: props.maxHeight ? props.maxHeight : ''}} className={`table-responsive mb-5 flex items-center justify-between`}>
                        <table className="border text-nowrap text-md-nowrap table-hover table-bordered table-sm mb-0" style={{width: '100%'}} {...props}>
                            { columns && <thead>
                            <tr>
                                {renderHeads ? renderHeads(columns, renderHead, data, page) : columns.map(_ => <th key={_.key} {..._}>
                                    {renderHead(_)}
                                </th>)}
                                {isActions && <th style={{width:'10px', ...actionsHeadStyle}}>Действия</th>}
                            </tr>
                            </thead>}
                            <tbody>
                            {
                                renderRows ? renderRows(columns, renderCell, data, page, renderActions) : page.map((row, rowIndex) =>
                                    <tr style={row.style} key={row.key} onClick={(e) => {
                                        if (!onSelect)
                                            return;

                                        if (e.target.className?.indexOf('prevent') >= 0)
                                            return;
                                        onSelect(row, data, page);
                                    }}>
                                        {columns.map((column, columnIndex) =>
                                            renderCell(row, column, page, data, columnIndex, rowIndex))
                                        }
                                        {isActions && <td>
                                            {renderActions(row)}
                                        </td>}
                                    </tr>)

                            }
                            {renderFooters && renderFooters(data)}
                            </tbody>
                        </table>
                    </div>
            )
        }}
    />
}
export default SheetTable;
