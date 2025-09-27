'use client';

import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import fp from 'flatpickr';
import { Select2 } from './select';
import { ResourceSelect2 } from './resourceSelect2';
import Lookup from './lookup';
import ResourceLookup from './resourceLookup';
import IconX from '@/components/icon/icon-x';

export const Field = ({type = "text", orientation, value, onChange, options,  ...props}) => {
    const vertical = orientation=="vertical";
    const nullable = props.nullable || options?.nullable;
    const handleNullableInput = (e) => {
        if (!nullable) return;
        const v = e?.target?.value;
        if (v == null || v.trim() === '') {
            onChange && onChange(null);
        }
    };

    switch (type) {
        case "label":
            return <label
                className="form-input" {...props}>{value}</label>
        case "text":
            return <input type={options?.type || "text"} placeholder={vertical ? props.placeholder : ""}
                className="form-input"
                value={value} onChange={(e) => {
                    onChange && onChange(e.target.value);
                }} {...props} />
        case "textarea":
            return <textarea className={props.className || "form-input"}
                placeholder={vertical ? placeholder : ""}
                rows={options?.rows || 3} style={{width:'100%', ...props.style}}
                value={value} onChange={(e) => {
                    onChange && onChange(e.target.value);
                }}
                {...props} ></textarea>
        case "number":
            return <input type="number" placeholder={vertical ? props.placeholder : ""}
                className="form-input"
                value={value} onChange={(e) => {
                    onChange && onChange(e.target.value);
                }} {...props} />
        case "boolean":
        case "checkbox":
            return <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="form-checkbox"
                    checked={value}
                    onChange={(e) => {
                        onChange && onChange(e.target.checked);
                    }} {...props} />
                <span className=" text-white-dark">{props.label || props.placeholder}</span>
            </label>
        case "multicheckbox":
            return <div className="flex flex-col">
                {options.map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                        <input type="checkbox" className="form-checkbox"
                            checked={value && value.includes(option)}
                            onChange={() => {
                                if (!value || !value.push)
                                    return;

                                const selected = value.includes(option) ?
                                    value.filter((_) => _ !== option) :
                                    [...value, option];
                                    onChange && onChange(selected);
                            }}
                        />
                        <span className=" text-white-dark">{option}</span>
                    </label>
                    )
                )}
            </div>
        case "date":
            return <Flatpickr
                className="form-input"
                value={value}
                options={{
                    dateFormat: "d.m.Y" || options?.dateFormat,
                    allowInput: nullable || options?.inputOptions?.allowInput
                }}
                onChange={(newValue) => {
                    if (newValue.length)
                        onChange && onChange(newValue[0]);
                    else
                        onChange && onChange(newValue);
                }}
                onInput={handleNullableInput}
            />
        case "datetime":
            return <Flatpickr
                data-enable-time
                className="form-input"
                value={value}
                options={{
                    enableTime: options?.enableTime || true,
                    dateFormat: "d.m.Y H:i" || options?.dateFormat,
                    time_24hr: true,
                    allowInput: nullable || options?.inputOptions?.allowInput,
                    ...options?.inputOptions
                }}
                onChange={(newValue) => {
                    if (newValue.length)
                        onChange && onChange(newValue[0]);
                    else
                        onChange && onChange(newValue);
                }}
                onInput={handleNullableInput}
            />
        case "time":
            const TZ_MIN = 5 * 60; // UTC+5
            const toTarget = (date) => {
                const localOffset = -date.getTimezoneOffset();
                const delta = TZ_MIN - localOffset;
                return new Date(date.getTime() + delta * 60000);
            };
            const fromTarget = (date) => {
                return new Date(date.getTime());
            };

            const uiValue = typeof value === 'number' ? new Date(value) : value;

            return <div style={{ position: 'relative', display: 'inline-flex', width: '100%' }}>
                <Flatpickr
                    data-enable-time
                    className="form-input"
                    value={uiValue}
                    options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "H:i" || options?.dateFormat,
                        time_24hr: true,
                        formatDate: (date, format, locale) => fp.formatDate(toTarget(date), format, locale),
                        parseDate: (str, format) => {
                            return fromTarget(fp.parseDate(str, format))
                        },
                        ...options?.inputOptions
                    }}
                    onChange={(newValue) => {
                        if (newValue.length) {
                            onChange && onChange(newValue[0]);
                        } else
                            onChange && onChange(newValue);
                    }}
                    onInput={handleNullableInput}
                />
                {nullable && uiValue ? (
                    <button
                        type="button"
                        className="btn btn-sm btn-xsm prevent"
                        style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)' }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onChange && onChange(null);
                        }}
                    >
                        <IconX />
                    </button>
                ) : null}
            </div>
        case "radiogroup":
            return <div className="space-y-2">
                {options.map((option, index) => (
                    <div>
                        <label key={index} className="inline-flex">
                            <input type="radio" className="form-radio"
                                checked={value == index}
                                onChange={() => {
                                    onChange && onChange(index);
                                }}
                            />
                            <span className=" text-white-dark">{option}</span>
                        </label>
                    </div>
                    )
                )}
            </div>
        case "select":
            return <Select2 options={options}
                value={value}
                onChange={onChange}
                placeholder={vertical ? placeholder : ""}
                {...props}
            />
        case "resourceselect":
            return <ResourceSelect2
                value={value}
                onChange={onChange}
                placeholder={vertical ? placeholder : ""}
                {...props} />
        case "lookup":
            return <Lookup options={options}
                value={value}
                onChange={onChange}
                placeholder={vertical ? placeholder : ""}
                {...props}
            />
        case "resourcelookup":
            return <ResourceLookup options={options}
                value={value}
                onChange={onChange}
                placeholder={vertical ? placeholder : ""}
                {...props}
            />
        // case "hierarchyresourcelookup":
        //     return <HierarchyResourceLookup options={options}
        //         value={value}
        //         onChange={onChange}
        //         placeholder={vertical ? placeholder : ""}
        //         {...props}
        //     />

        default:
            return <><span>Type {type} is not supported</span></>
    }
}
