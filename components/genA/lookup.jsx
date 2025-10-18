'use client';

import { useState } from 'react';
// import React, { useState } from "react";
// import { Button, Form, InputGroup } from 'react-bootstrap';
import Details2 from './details2';
import { Field } from './field';
import IconEye from '@/components/icon/icon-eye';
import IconX from '@/components/icon/icon-x';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import SheetTable from './sheetTable';
// import Table2 from './table';
// import { PopoverButton } from "../form/popover";
// import Details2 from "./details2";
// import styles from "/styles/login.module.scss"

export default function Lookup({options, fullWidth = true, placeholder, formatValue, lookupValue, value, onChange, mode = 'modal', ...props}) {
    const [detailsShow, setDetailsShow] = useState(false);
    const render = options?.table?.render;

    let formattedValue = formatValue ? formatValue(value) : value?.id;
    if(formattedValue == null){
        if(lookupValue != null){
            formattedValue = lookupValue;
        }
    }

    switch (mode) {
        case 'popover':
            return (
                <>
                    <div class="flex">
                        <Field type="text" value={formattedValue} readOnly={true} {...props} placeholder={placeholder} />
                        <Tippy visible={detailsShow} interactive={true} arrow={true} onClickOutside={() => setDetailsShow(false)} render={_ => <div {..._} style={{backgroundColor: 'white'}}>
                                <h3 style={{display: "inline"}}>{options?.details?.formatTitle ? options?.details?.formatTitle(options?.details?.resourceName) : `Выбор ${options?.details?.resourceName || ""}`}</h3>
                                {render ? render(options, setDetailsShow) : <SheetTable {...options?.table} actions={{
                                        onSelect: (row) => {
                                            onChange && onChange(row);
                                            setDetailsShow(false);
                                        }
                                     }} {...props} />}
                            </div>} placement="left">
                            <div class="bg-info flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-[#e0e6ed] dark:border-[#17263c] cursor-pointer"
                                onClick={_ => setDetailsShow(!detailsShow)}>
                                <IconEye className="h-5 w-5 text-white" />
                            </div>
                            <div class="bg-danger flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-[#e0e6ed] dark:border-[#17263c] cursor-pointer" onClick={() => onChange(null)}>
                                <IconX className="h-5 w-5 text-white" />
                            </div>
                        </Tippy>
                    </div>
                </>
            );
        default:
            return (
                <>
                    <div class="flex" style={{width: '100%'}}>
                        <Field type="text" value={formattedValue} readOnly={true} {...props} placeholder={placeholder} />
                        <div class="bg-info flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-[#e0e6ed] dark:border-[#17263c] cursor-pointer" onClick={() => setDetailsShow(true)}>
                            <IconEye className="h-5 w-5 text-white" />
                        </div>
                        <div class="bg-danger flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-[#e0e6ed] dark:border-[#17263c] cursor-pointer" onClick={() => onChange(null)}>
                            <IconX className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <Details2 show={detailsShow} setShow={setDetailsShow} 
                        size={options?.details?.size || "3xl"}
                        {...options?.details} 
                        {...props}
                        //dialogClassName="modal-90w"
                        formatTitle={options?.details?.formatTitle || ((_) => `Выбор ${_ || ""}`)}
                    >
                        {render ? render(options, setDetailsShow) : <SheetTable {...options?.table} actions={{
                            onSelect: (row) => {
                                onChange && onChange(row);
                                setDetailsShow(false);
                            }
                        }} {...props} />}
                    </Details2>
                </>
            );
    }
}
