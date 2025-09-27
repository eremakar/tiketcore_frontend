import Filter from '../filter';
import Sort from '../sort';
import { Field } from '../field';
import Dropdown from '@/components/dropdown';
import Tippy from "@tippyjs/react";
import IconRefresh from '@/components/icon/icon-refresh';
import IconPlus from '@/components/icon/icon-plus';

const List2Panel = ({ query, setQuery, columns,
    filters, filterMode, showFilter, setShowFilter, filterProps, isFilter,
    isSort, sorts, sortMode, defaultSort, showSort, setShowSort, sortProps,
    isGroup, groups, groupKey, setGroupKey, onGroupKeyChange,
    isFetch, fetch,
    renderActions,
    renderAdvancedActions, onCreate, renderCreateVariants, ...props }) => {
    groups = groups || [];
    const groupOptions = groups.map(_ => {
        return {
            id: _.key,
            name: _.title
        }
    });

    const CreateButton = () => {
        if (!onCreate) return null;

        if (renderCreateVariants) {
            return (
                <div className="btn-group">
                    <button className="btn btn-sm btn-success" onClick={() => onCreate()}>
                        <IconPlus />
                        Создать
                    </button>
                    <Dropdown btnClassName="btn btn-sm btn-success" button={<i className="fe fe-chevron-down"></i>} placement="bottom-end">
                        <div className="dropdown-menu show" style={{display: 'block', position: 'static'}}>
                            {renderCreateVariants()}
                        </div>
                    </Dropdown>
                </div>
            );
        }

        return (
            <button className="btn btn-sm btn-success" onClick={() => onCreate()}>
                <IconPlus />
                Создать
            </button>
        );
    };

    return <table style={{ width: '100%', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRight: 'none', borderCollapse: 'separate', borderSpacing: 0 }}>
        <tbody>
        <tr key={1}>
            <td style={{width: '70px', border: '0'}}>
                <h3>Данные</h3>
            </td>
            <td>
                <div className="flex gap-2">
                    {isFetch && <Tippy content="Обновить">
                        <button type="button" class="btn btn-primary" onClick={async () => await fetch()}>
                            <IconRefresh />
                        </button>
                    </Tippy>}
                    {isFilter && <Filter
                    query={query}
                    setQuery={setQuery}
                    schema={filters}
                    mode={filterMode}
                    part={1}
                    show={showFilter}
                    setShow={setShowFilter}
                    {...filterProps}
                    />}
                    {isSort && <Sort
                    query={query}
                    setQuery={setQuery}
                    schema={{ sorts, columns, filters }}
                    mode={sortMode}
                    part={1}
                    defaultSort={defaultSort}
                    show={showSort}
                    setShow={setShowSort}
                    {...sortProps}
                    />}
                    {renderAdvancedActions && renderAdvancedActions()}
                </div>
                {groups?.length > 0 ? <><div>
                    <h3 className="card-title">Группировка</h3>
                </div>
                <div style={{minWidth: '150px'}}>
                    <Field type='select' value={groupKey} options={groupOptions} isNullable={true} onChange={(value, obj) => {
                        setGroupKey(value);
                        onGroupKeyChange && onGroupKeyChange(value, obj);
                    }} />
                </div></> : <></>}
            </td>
            <td>
                <div className="btn-list" style={{ float: 'right' }}>
                    <CreateButton />
                    {renderActions && renderActions()}
                </div>
            </td>
        </tr>
        {isFilter && filterMode != 'popup' && (
            <tr key={2}>
            <td colSpan={3} style={{ padding: '5px', border: '0' }}>
                <Filter
                query={query}
                setQuery={setQuery}
                schema={filters}
                mode={filterMode}
                part={2}
                show={showFilter}
                setShow={setShowFilter}
                {...filterProps}
                {...props}
                />
            </td>
            </tr>
        )}
        {isSort && sortMode != 'popup' && (
            <tr key={3}>
            <td colSpan={3} style={{ padding: '5px', border: '0' }}>
                <Sort
                query={query}
                setQuery={setQuery}
                schema={{ sorts, columns, filters }}
                mode={sortMode}
                part={2}
                defaultSort={defaultSort}
                show={showSort}
                setShow={setShowSort}
                {...sortProps}
                {...props}
                />
            </td>
            </tr>
        )}
        </tbody>
    </table>
}

export default List2Panel;
