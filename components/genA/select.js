'use client';

import Select from 'react-select';

export const Select2 = ({ options, placeholder, orientation, value, onChange, isNullable, isNullLabel = 'Не указано', mode, ...props }) => {
    const vertical = orientation=="vertical";

    const valueMemberName = props.valueMemberName || "id";
    const labelMemberName = props.labelMemberName || "name";
    const labelMemberFunc = props.labelMemberFunc;
    const codeMemberName = props.codeMemberName || "code";

    let mappedOptions = options.map(_ => {
        const label = labelMemberFunc ? labelMemberFunc(_) : _[labelMemberName];
        return { value: _[valueMemberName], label: label, code: _[codeMemberName] }
    });

    if (isNullable)
        mappedOptions = [{ value: '', label: isNullLabel, code: '' }].concat(mappedOptions);

    const find = (value) => {
        return mappedOptions.find(_ => _.value == value);
    }

    const item = value ? find(value) : (isNullable ? mappedOptions[0] : null);

    return <Select
        classNamePrefix="Select-sm"
        placeholder={vertical ? placeholder : ""}
        menuPortalTarget={null}
        menuPosition={mode == 'portal' ? 'fixed' : null}
        menuPlacement={mode == 'portal' ? 'auto' : 'bottom'}
        value={item}
        options={mappedOptions}
        onChange={(e) => {
            const item = e;
            onChange && onChange(item.value);

            if (props.objectMemberName && props.setValue) {
                const obj = {};
                obj[valueMemberName] = item.value;
                obj[labelMemberName] = item.label;
                obj[codeMemberName] = item.code;
                props.setValue(props.objectMemberName, obj);
            }
        }}
        {...props}
    />
}
