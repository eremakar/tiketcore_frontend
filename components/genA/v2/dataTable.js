import React from 'react';
import { clearSort, setSort2, switchSort } from '@/components/genA/functions/query'
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import List2 from './list';
import DataRow2 from './dataRow';
import DataTable2Childrens from './dataTableChildrens';
import { useEffect, useRef, useState } from 'react';
import { dataTableEventTypeIds } from '@/components/genA/v2/dataTableEventTypeIds';
import { groupBy } from '@/components/genA/functions/linq1';
import CollapseRow from '../collapseRow';
import IconEdit from '@/components/icon/icon-edit';
import IconPlus from '@/components/icon/icon-plus';
import IconX from '@/components/icon/icon-x';
import IconSquareCheck from '@/components/icon/icon-square-check';
import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconMinus from '@/components/icon/icon-minus';
import IconEye from '@/components/icon/icon-eye';
import IconTrash from '@/components/icon/icon-trash';

const DataTable2Inner = ({
  context,
  data,
  projectedData,
  setData,
  query,
  setQuery,
  columns,
  filters,
  sorts,
  groups,
  defaultGroupKey,
  groupMode = 'column',
  renderHeads,
  renderRows,
  renderRow,
  actions,
  isHead=true,
  isActionsRendered=true,
  actionsHeadStyle,
  row,
  fullHeight = false,
  setRow,
  renderRowActions,
  leftActions,
  leftActionAdd=true,
  leftActionEdit=true,
  leftActionsAdd = true,
  selectedRowId,
  leftActionsAddIndices,
  forceShowAdd = false,
  rowEditMode = 'manual',
  hoverUI = true,
  renderCell,
  labelDisplayedRows,
  useDnd,
  isDndAction=true,
  dragType,
  dropType,
  dragInfo,
  dropInfo,
  onDrop,
  onChange,
  onRowClick,
  dataSource,
  onGroupKeyChange,
  collapsedGroups,
  onToggleGroup,
  hierarchyId,
  enableHierarchy,
  hierarchyMember,
  hierarchyLevel,
  enableCellEditOnDoubleClick = false,
  renderExpandedRow,
  ...props
}) => {
  columns = columns.filter(_ => !_.hidden);
  const [changingRow, setChangingRow] = useState(null);
  const [groupKey, setGroupKey] = useState(defaultGroupKey);

  useEffect(() => {
    if (!groupKey)
      return;
    localStorage.setItem('groupKey', groupKey);
  }, [groupKey]);

  const rowEditModeIsManual = rowEditMode == 'manual';

  const DragButton = (item, hidden, hoverVisibility) => {
    const [{ opacity }, dragRef] = useDrag(
        () => {
          return {
            type: dragType || "row",
            item: { item, dragInfo },
            collect: (monitor) => {
              return {
                opacity: monitor.isDragging() ? 0.5 : 1
              }
            }
        }},
        [item?.id]
    )
    return <>
      <button className="btn btn-sm btn-xsm prevent" style={{marginRight:'2px', display: hidden ? 'none': 'inline'}} ref={dragRef}><IconLayoutGrid /></button>
    </>
  }

  const dropInfoRef = useRef(dropInfo);

  useEffect(() => {
    dropInfoRef.current = dropInfo;
  }, [dropInfo]);

  const [{ canDrop, isOver, didDrop, item }, drop] = useDrop(() => ({
    accept: dropType || "row",
    drop: (item) => {
        onDrop && onDrop(item, dropInfoRef.current);
        return {};
    },
    collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        didDrop: monitor.didDrop(),
        item: monitor.getItem()
    }),
  }));

  const addRowAtStart = async () => {
    setChangingRow(null);
    const newRow = wrap({});
    newRow.isEdit = true;
    if (onChange)
      await onChange({ target: newRow, data: { context: context, position: 'start' }, type: dataTableEventTypeIds.newRow });
    setData([newRow, ...data]);
  }

  const addRowAtEnd = async () => {
    setChangingRow(null);
    const newRow = wrap({});
    newRow.isEdit = true;
    if (onChange)
      await onChange({ target: newRow, data: { context: context, position: 'end' }, type: dataTableEventTypeIds.newRow });
    setData([...data, newRow]);
  }

  const editRow = async (wrappedRow, data, value) => {
    const index = data.findIndex(_ => _.row.id == wrappedRow?.row?.id);
    wrappedRow.isEdit = value;
    data[index] = { ...wrappedRow };
    setData([...data]);
  }

  const commit = async (wrappedRow, data, changingRow) => {
    if (changingRow != null) {
      wrappedRow.row = changingRow.row;
    }
    await editRow(wrappedRow, data, false);
    if (onChange)
      await onChange({ target: wrappedRow, data: { context: context }, type: dataTableEventTypeIds.commitRow });
    setData([...data]);
  }

  const rollback = async (wrappedRow) => {
    wrappedRow.row = {...wrappedRow.row};
    await editRow(wrappedRow, data, false);
    if (onChange)
      await onChange({ target: wrappedRow, data: { context: context }, type: dataTableEventTypeIds.rollbackRow });
    setData([...data]);
  }

  const remove = async (index) => {
    const row = data[index];
    data.splice(index, 1);
    if (onChange)
      await onChange({ target: row, data: { context: context }, type: dataTableEventTypeIds.removedRow });
    setData([...data]);
  }

  const renderLeftActions = (value, wrappedRow, data, setData, index, changingRow) => {
    const row = wrappedRow?.row;
    const isEdit = wrappedRow?.isEdit;

    const result = [];

    if (!data || !row)
      return result;

    const workingData = projectedData || data;

    const hoverVisibility = wrappedRow.isHover ? 'visible': 'hidden';

    if (useDnd && isDndAction) {
      result.push(DragButton(row, isEdit, hoverVisibility));
    }

    if (leftActionsAdd) {
      if (index == 0 && workingData.length > 0 && leftActionAdd) {
        result.push(<button className="btn btn-sm btn-xsm prevent" style={{marginRight:'2px'}} onClick={async (e) => {
          e.preventDefault();
          await addRowAtStart();
        }}><IconPlus /></button>);
      }

      if (index == workingData.length - 1 && workingData.length > 1 && leftActionAdd) {
        result.push(<button className="btn btn-sm btn-xsm prevent" style={{marginRight:'2px'}} onClick={async (e) => {
          e.preventDefault();
          await addRowAtEnd();
        }}><IconPlus /></button>);
      }
    }

    if (rowEditModeIsManual) {
      if (isEdit) {
        result.push(<button className="btn btn-sm btn-xsm prevent" style={{marginRight:'2px'}} onClick={async (e) => {
          e.preventDefault();
          await commit(wrappedRow, data, changingRow);
        }}><IconSquareCheck /></button>);
        result.push(<button className="btn btn-sm btn-xsm prevent" style={{marginRight:'2px'}} onClick={async (e) => {
          e.preventDefault();
          if (row.id)
            await rollback(wrappedRow, data);
          else {
            await remove(index);
          }
        }}><IconX /></button>);
      } else if (leftActionEdit) {
        result.push(<button className="btn btn-sm btn-xsm prevent" style={{marginRight:'2px'}} onClick={async (e) => {
          e.preventDefault();
          await editRow(wrappedRow, data, true);
        }}><IconEdit /></button>);
      }
    }

    return result;
  }

  if (leftActions || useDnd) {
    columns = [{
      key: 'leftActions',
      style: {width: '10px', paddingRight: '0px'},
      render: (value, wrappedRow, onChange, data, setData, index, changingRow) => {
        return renderLeftActions(value, wrappedRow, data, setData, index, changingRow);
      },
      renderHead: (column, data, setData) => {
        return ((leftActionsAdd && data?.length == 0) || forceShowAdd) ? <button className="btn btn-sm btn-xsm prevent" onClick={async (e) => {
          e.stopPropagation();
          await addRowAtEnd();
        }}><IconPlus /></button> : <></>
      }
    }, ...columns];
  }

  const { sort } = query?.sort ? query || { sort: {} } : { sort: {} };

  const renderHead = (column, data, setData) => {
    const sortKey = column.sortKey || column.key
    const sortValue = sort[sortKey]
    const sortOperator = sortValue?.operator
    const isSortable =
      (filters || []).find((_) => _.key == sortKey && _.isSortable) ||
      (sorts || []).find((_) => _.key == sortKey)
    return (
      <>
        {column.renderHead ? column.renderHead(column, data, setData) : <span>{column.title}</span>}
        {isSortable && (
          <span style={{ float: 'right' }} onClick={() => setSort(column)}>
            {sortOperator == 'desc' ? (
              <i className="fa fa-angle-down"></i>
            ) : (
              <i className="fa fa-angle-down" style={{ opacity: 0.4 }}></i>
            )}
            {sortOperator == 'asc' ? (
              <i className="fa fa-angle-up"></i>
            ) : (
              <i className="fa fa-angle-up" style={{ opacity: 0.4 }}></i>
            )}
          </span>
        )}
        {column.renderHeadFooter && column.renderHeadFooter(column, data, setData)}
      </>
    )
  }

  const setSort = (column) => {
    const sortKey = column.sortKey || column.key
    const sortValue = sort[sortKey]

    if (sortValue) {
      switchSort(sort, sortKey)
    } else {
      clearSort(sort)
      setSort2(sort, sortKey, 'desc')
    }

    setQuery({ ...query, sort: { ...sort } })
  }

  actions = actions || {};

  const { onEdit, onDelete, onDetails } = actions
  const isActions = onEdit || onDelete || onDetails || renderRowActions;

  const renderActions = (row) => {
    return (
      <div style={{display: 'flex', gap: '2px'}}>
        {onEdit && (
          <button
            className="btn btn-sm btn-xsm prevent"
            onClick={async (e) => {
              e.stopPropagation();
              await onEdit(row);
            }}
          >
            <IconEdit />
          </button>
        )}
        {onDelete && (
          <button
            className="btn btn-sm btn-xsm prevent"
            onClick={async (e) => {
              e.stopPropagation();
              await onDelete(row);
            }}
          >
            <IconTrash />
          </button>
        )}
        {onDetails && (
          <button
            className="btn btn-sm btn-xsm prevent"
            onClick={async (e) => {
              e.stopPropagation();
              await onDetails(row);
            }}
          >
            <IconEye />
          </button>
        )}
        {renderRowActions && renderRowActions(row)}
      </div>
    )
  }

  const wrap = (aRow) => {
    return {
      row: aRow,
      isEdit: false,
      cells: columns.map(_ => {
        return {
          key: _.key,
          isEdit: false
        }
      })
    }
  }

  const renderHirearchy = (items, parentKey, level) => {
    return items.map((wrappedRow, index) => {
      const aRow = wrappedRow.row;
      const selected = selectedRowId ? aRow?.id == selectedRowId : aRow?.id == row?.id;

      const children = aRow?.id ? data.filter(_ => _.row[parentKey] == aRow?.id) : [];

      const colors = ['#D9E1F2', '#BFBFBF'];
      const color = level < colors.length ? colors[level] : null;

      return <>
      <DataRow2 key={index} sourceWrappedRow={wrappedRow} data={data} setData={setData} columns={columns}
        dragType={dragType}
        dragInfo={dragInfo}
        selected={selected} setRow={setRow} onRowClick={onRowClick} isActions={isActions}
        index={index}
        renderActions={renderActions}
        isEdit={wrappedRow.isEdit}
        render={renderRow}
        style={{backgroundColor: color}}
        enableCellEditOnDoubleClick={enableCellEditOnDoubleClick}
        onChange={async (_, type, mode) => {
          setChangingRow(_);

          if (mode == 'list' || mode == 'editCommitted') {
            if (onChange)
              await onChange({ target: wrappedRow, data: { context: context, type: 'blur', mode: mode }, type: dataTableEventTypeIds.commitRow });
            return;
          }

          if (type != 'blur')
            return;
          if (onChange)
            await onChange({ target: wrappedRow, data: { context: context, type: 'blur' }, type: dataTableEventTypeIds.commitRow });
        }}
        />
        {renderHirearchy(children, parentKey, level + 1)}
        </>
    });
  }

  return (
    <List2
      data={data}
      setData={setData}
      query={query}
      setQuery={setQuery}
      dataSource={dataSource}
      columns={columns}
      filters={filters}
      sorts={sorts}
      groups={groups}
      groupKey={groupKey}
      setGroupKey={setGroupKey}
      actions={actions}
      onGroupKeyChange={onGroupKeyChange}
      wrapData={_ => {
        if (!_?.map)
          return [];

        return _.map(i => wrap(i));
      }}
      labelDisplayedRows={labelDisplayedRows}
      renderAdvancedActions={() => {
        return row ? renderActions(row) : <></>;
      }}
      {...props}
      render={({ data, setData, columns, filters, sorts, props }) => {
        const quickActions = columns.filter(_ => _.key == 'leftActions');
        const group = groups?.find(_ => _.key == groupKey);
        const type = group?.type;

        switch (type) {
          case "hierarchy":
            const parentKey = group.parentKey || 'parentId';
            const rootData = data?.filter(_ => _.row[parentKey] == null);

            return <div className={`table-responsive mb-5 flex ${fullHeight ? 'flex-col h-full' : 'items-center justify-between'}`} style={{...props.style}}>
              <table className="border text-nowrap text-md-nowrap table-hover table-bordered table-sm mb-0">
                {columns && isHead && (
                  <thead>
                    <tr>
                      {renderHeads
                        ? renderHeads(columns, renderHead, data)
                        : columns.map((_) => {
                          return <th key={_.key} style={_.style || {}}>{renderHead(_, data, setData)}</th>
                        })}
                      {isActions && isActionsRendered && <th style={{ width: '10px', ...actionsHeadStyle }}>Действия</th>}
                    </tr>
                  </thead>
                )}
                {!isHead && data && data.length == 0 && <thead>
                  <tr>
                    {quickActions.map((_) => <th key={_.key} style={_.style || {}}>{renderHead(_, data, setData)}</th>)}
                  </tr>
                </thead>}
                <tbody>
                  {rootData && renderHirearchy(rootData, parentKey, 0)}
                </tbody>
              </table>
            </div>
          default:
            if (groupKey) {
              const groupSelector = group.groupSelector;
              const groupedData = (data && !groupSelector) ? groupBy(data, group.selector ? _ => group.selector(_.row) : _ => _.row[groupKey], (key1, key2) => key1 == key2, group.sortFunc) : [];
              const keys = group?.keys || groupedData.map(_ => _.key);
              const mapName = group?.mapName;
              const width = group?.width || '400px';
              const height = group?.height || '60vh';

              switch (groupMode) {
                case 'column':
                  return <div className="table-responsive mb-5 flex items-center justify-between" style={{...props.style, width: 'auto', padding: '0px', margin: '0px'}}>
                    <table className="border text-nowrap text-md-nowrap table-hover table-bordered table-sm mb-0" style={{width: 'auto'}}>
                      <thead>
                        <tr>
                        {keys.map((_, index) => {
                          const groupItem = groupedData.find(i => i.key == _);
                          const isCollapsed = collapsedGroups?.[_];
                          return <th key={index} style={{
                            minWidth: isCollapsed ? '50px' : '300px',
                            width: isCollapsed ? '50px' : '300px',
                            textAlign: 'center',
                            paddingTop: '2px',
                            paddingBottom: '2px',
                            color: 'whitesmoke',
                            position: 'relative'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginRight: '5px'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                gap: '8px'
                              }}>
                                {index === 0 && (
                                  <div style={{
                                    display: 'flex',
                                    gap: '4px'
                                  }}>
                                    <button
                                      className="btn btn-sm btn-xsm prevent"
                                      onClick={() => {
                                        const newState = {};
                                        keys.forEach(key => {
                                          newState[key] = true;
                                        });
                                        onToggleGroup && onToggleGroup(newState);
                                      }}
                                    >
                                      <i className="fa fa-angle-double-left fs-14"></i> Свернуть все
                                    </button>
                                    <button
                                      className="btn btn-sm btn-xsm prevent"
                                      onClick={() => {
                                        const newState = {};
                                        keys.forEach(key => {
                                          newState[key] = false;
                                        });
                                        onToggleGroup && onToggleGroup(newState);
                                      }}
                                    >
                                      <i className="fa fa-angle-double-right fs-14"></i> Развернуть все
                                    </button>
                                  </div>
                                )}
                                <div style={{flex: 1, textAlign: 'center'}}>
                                  {mapName ? mapName(_, groupItem) : _}
                                </div>
                              </div>
                              <button
                                className="btn btn-sm btn-xsm prevent"
                                style={{position: 'absolute', right: '2px', top: '2px'}}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onToggleGroup && onToggleGroup(_);
                                }}
                              >
                                <i className={`fa fa-${isCollapsed ? 'expand' : 'compress'} fs-14 prevent`}></i>
                              </button>
                            </div>
                          </th>
                        })}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                        {keys.map((_, index) => {
                          const group = !groupSelector ? groupedData.find(i => i.key == _) : {
                            key: _,
                            values: data.filter(i => groupSelector(i, _))
                          };
                          const values = group?.values || [];
                          const values2 = group?.values || data;
                          //const hierarchyValues = hierarchyMember ? values.filter(_ => !_.row[hierarchyMember]) : values;
                          const addIndices = leftActionsAddIndices || [];
                          const leftActionsAdd = leftActionsAddIndices.find(i => i == _);
                          const isCollapsed = collapsedGroups?.[_];
                          const groupItem = groupedData.find(i => i.key == _);

                          return isCollapsed ? (
                            <td key={index} style={{
                              minWidth: '50px',
                              width: '50px',
                              padding: '0',
                              height: '100%',
                              verticalAlign: 'top'
                            }}>
                              <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                background: '#fff',
                                borderRight: '1px solid #dee2e6',
                                minHeight: '500px'
                              }}>
                                <button
                                  className="btn btn-sm btn-xsm prevent"
                                  style={{
                                    margin: '4px 0',
                                    padding: '2px 4px',
                                    zIndex: 1
                                  }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onToggleGroup && onToggleGroup(_);
                                  }}
                                >
                                  <i className="fa fa-expand fs-14 prevent"></i>
                                </button>
                                <div style={{
                                  writingMode: 'vertical-rl',
                                  transform: 'rotate(180deg)',
                                  whiteSpace: 'nowrap',
                                  padding: '20px 0',
                                  fontSize: '14px'
                                }}>
                                  {mapName ? mapName(_, groupItem) : _}
                                </div>
                                <div style={{
                                  writingMode: 'vertical-rl',
                                  transform: 'rotate(180deg)',
                                  whiteSpace: 'nowrap',
                                  marginTop: 'auto',
                                  padding: '10px 0',
                                  fontSize: '12px',
                                  color: '#666'
                                }}>
                                  {values.length} задач
                                </div>
                              </div>
                            </td>
                          ) : (
                            <td key={index} style={{
                              minWidth: '300px',
                              width: '300px',
                              verticalAlign: 'top',
                              padding: '8px'
                            }}>
                              <DataTable2Inner
                                projectedData={values}
                                data={data}
                                setData={setData}
                                columns={columns}
                                renderRow={renderRow}
                                onChange={onChange}
                                isHead={false}
                                isPager={false}
                                isTopPanel={false}
                                isBottomPanel={false}
                                dragInfo={{key: _}}
                                dropInfo={{key: _}}
                                onDrop={onDrop}
                                leftActionsAdd={leftActionsAdd}
                                style={{height: height}}
                                bodyStyle={{padding: '0px'}}
                                onRowClick={onRowClick}
                                enableHierarchy={enableHierarchy}
                                hierarchyMember={hierarchyMember}
                                hierarchyLevel={hierarchyLevel + 1}
                              />
                            </td>
                          );
                        })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  case 'row':
                    return <div className={`table-responsive mb-5 flex ${fullHeight ? 'h-full flex-col' : 'items-center justify-between'}`} style={{...props.style}}>
                      <table className="border text-nowrap text-md-nowrap table-hover table-bordered table-sm mb-0">
                        {columns && isHead && (
                          <thead>
                            <tr>
                              {renderHeads
                                ? renderHeads(columns, renderHead, data)
                                : columns.map((_) => {
                                  return <th key={_.key} style={_.style || {}}>{renderHead(_, data, setData)}</th>
                                })}
                              {isActions && isActionsRendered && <th style={{ width: '10px', ...actionsHeadStyle }}>Действия</th>}
                            </tr>
                          </thead>
                        )}
                        {!isHead && data && data.length == 0 && <thead>
                          <tr>
                            {quickActions.map((_) => <th key={_.key} style={_.style || {}}>{renderHead(_, data, setData)}</th>)}
                          </tr>
                        </thead>}
                        <tbody>
                          {keys.map((_, index) => {
                            const group = groupedData.find(i => i.key == _);
                            const values = group?.values || [];
                            const addIndices = leftActionsAddIndices || [];
                            //const leftActionsAdd = leftActionsAddIndices.find(i => i == _);
                            return <CollapseRow key={index} colSpan={columns.length} renderRow={() => {
                              const groupItem = groupedData.find(i => i.key == _);
                              return <td colSpan={columns.length + 1}>{mapName(_, groupItem)}</td>
                            }} renderCollapse={() => {
                              return <>
                                {values.map((wrappedRow, index) => {
                                    const aRow = wrappedRow.row;
                                    const selected = selectedRowId ? aRow?.id == selectedRowId : aRow?.id == row?.id;

                                    return <DataRow2 key={index} sourceWrappedRow={wrappedRow} data={data} setData={setData} columns={columns}
                                      dragType={dragType}
                                      dragInfo={dragInfo}
                                      selected={selected} setRow={setRow} onRowClick={onRowClick} isActions={isActions}
                                      index={index}
                                      renderActions={renderActions}
                                      isEdit={wrappedRow.isEdit}
                                      render={renderRow}
                                      enableCellEditOnDoubleClick={enableCellEditOnDoubleClick}
                                      onChange={async (_, type, mode) => {
                                        setChangingRow(_);

                                        if (mode == 'list' || mode == 'editCommitted') {
                                          if (onChange)
                                            await onChange({ target: wrappedRow, data: { context: context, type: 'blur', mode: mode }, type: dataTableEventTypeIds.commitRow });
                                          return;
                                        }

                                        if (type != 'blur')
                                          return;
                                        if (onChange)
                                          await onChange({ target: wrappedRow, data: { context: context, type: 'blur' }, type: dataTableEventTypeIds.commitRow });
                                      }}
                                      />
                                  })}
                              </>
                            }} />
                          })}
                        </tbody>
                      </table>
                    </div>
              }

            }
            break;
        }

        const projectedData2 = [];

        if (projectedData == null) {
          projectedData = data || [];
        }

        for (let i = 0; i < projectedData.length; i++) {
          const item = projectedData[i];
          const parentId = hierarchyMember ? item.row[hierarchyMember] : null;
          if (!parentId) {
            projectedData2.push(item);
          } else {
            const parent = projectedData.find(_ => _.row['id'] == parentId);
            if (!parent) {
              projectedData2.push(item);
            }
          }
        }
        //console.log(projectedData2);

        return (
          <div className={`table-responsive mb-5 flex ${fullHeight ? 'h-full flex-col' : 'items-center justify-between'}`} ref={drop} style={{...props.style}}>
            <table className="border text-nowrap text-md-nowrap table-hover table-bordered table-sm mb-0">
              {columns && isHead && (
                <thead>
                  <tr>
                    {renderHeads
                      ? renderHeads(columns, renderHead, data)
                      : columns.map((_) => <th key={_.key} style={_.style || {}}>{renderHead(_, data, setData)}</th>)}
                    {isActions && isActionsRendered && <th style={{ width: '10px', ...actionsHeadStyle }}>Действия</th>}
                  </tr>
                </thead>
              )}
              {!isHead && data && data.length == 0 && <thead>
                <tr>
                  {quickActions.map((_) => <th key={_.key} style={_.style || {}}>{renderHead(_, data, setData)}</th>)}
                </tr>
              </thead>}
              <tbody>
                {renderRows
                  ? renderRows(columns, renderCell, data, setData, renderActions)
                  : (projectedData2 || data)?.map((wrappedRow, index) => {
                    const aRow = wrappedRow.row;
                    const selected = selectedRowId ? aRow?.id == selectedRowId : aRow?.id == row?.id;
                    const isExpanded = wrappedRow.isExpanded;
                    const childrens = enableHierarchy ? data.filter(_ => _.row[hierarchyMember] == aRow.id) : [];

                    return (
                      enableHierarchy ? <React.Fragment key={index}>
                        <div style={{ position: 'relative' }}>
                          {/* Кнопка разворачивания/сворачивания */}
                          {enableHierarchy && childrens.length > 0 && (
                            <button
                              className="btn btn-sm btn-xsm prevent"
                              style={{
                                position: 'absolute',
                                left: '2px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                padding: '0px 0px',
                                fontSize: '8px',
                                zIndex: 10
                              }}
                              onClick={() => {
                                wrappedRow.isExpanded = !wrappedRow.isExpanded;
                                setData([...data]);
                              }}
                            >
                              <i className={`fa fa-${isExpanded ? 'minus' : 'plus'} fs-12 prevent`}></i>
                            </button>
                          )}
                          <DataRow2
                            sourceWrappedRow={wrappedRow}
                            data={data}
                            setData={setData}
                            columns={columns}
                            dragType={dragType}
                            dragInfo={dragInfo}
                            selected={selected}
                            setRow={setRow}
                            onRowClick={onRowClick}
                            isActions={isActions}
                            index={index}
                            renderActions={renderActions}
                            isEdit={wrappedRow.isEdit}
                            render={renderRow}
                            enableCellEditOnDoubleClick={enableCellEditOnDoubleClick}
                            onChange={async (_, type, mode) => {
                              setChangingRow(_);

                              if (mode == 'list' || mode == 'editCommitted') {
                                if (onChange)
                                  await onChange({ target: _, data: { context: context, type: 'blur', mode: mode }, type: dataTableEventTypeIds.commitRow });
                                return;
                              }

                              if (type != 'blur')
                                return;
                              if (onChange)
                                await onChange({ target: wrappedRow, data: { context: context, type: 'blur' }, type: dataTableEventTypeIds.commitRow });
                            }}
                          />
                        </div>

                        {/* Отрисовка дочерних элементов */}
                        {enableHierarchy && (
                          <DataTable2Childrens
                            data={data}
                            setData={setData}
                            columns={columns}
                            renderRow={renderRow}
                            onChange={onChange}
                            onRowClick={onRowClick}
                            dragType={dragType}
                            dragInfo={dragInfo}
                            dropInfo={dropInfo}
                            onDrop={onDrop}
                            hierarchyMember={hierarchyMember}
                            enableHierarchy={enableHierarchy}
                            parentId={aRow.id}
                            level={hierarchyLevel}
                            context={context}
                            row={row}
                            setRow={setRow}
                            isActions={isActions}
                            renderActions={renderActions}
                            isExpanded={wrappedRow.isExpanded}
                            enableCellEditOnDoubleClick={enableCellEditOnDoubleClick}
                            {...props}
                          />
                        )}
                      </React.Fragment> : <>
                        <DataRow2
                            sourceWrappedRow={wrappedRow}
                            data={data}
                            setData={setData}
                            columns={columns}
                            dragType={dragType}
                            dragInfo={dragInfo}
                            selected={selected}
                            setRow={setRow}
                            onRowClick={onRowClick}
                            isActions={isActions}
                            index={index}
                            renderActions={renderActions}
                            isEdit={wrappedRow.isEdit}
                            render={renderRow}
                            enableCellEditOnDoubleClick={enableCellEditOnDoubleClick}
                            onChange={async (_, type, mode) => {
                              setChangingRow(_);

                              if (mode == 'list' || mode == 'editCommitted') {
                                if (onChange)
                                  await onChange({ target: _, data: { context: context, type: 'blur', mode: mode }, type: dataTableEventTypeIds.commitRow });
                                return;
                              }

                              if (type != 'blur')
                                return;
                              if (onChange)
                                await onChange({ target: wrappedRow, data: { context: context, type: 'blur' }, type: dataTableEventTypeIds.commitRow });
                            }}
                          />

                        {/* Render expanded row content */}
                        {renderExpandedRow && renderExpandedRow(wrappedRow) && (
                          <tr>
                            <td colSpan={columns.length + (isActions ? 1 : 0)} style={{ padding: 0, border: 'none' }}>
                              {renderExpandedRow(wrappedRow)}
                            </td>
                          </tr>
                        )}

                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )
      }}
    />
  )
}
const DataTable2 = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DataTable2Inner {...props} />
    </DndProvider>
  );
}

export default DataTable2
