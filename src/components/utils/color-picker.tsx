"use client"
import { useCallback, useRef, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

interface props {
    field: any
}

const ColorPicker = ({ field }: props) => {

    return (
        <div>
            <HexColorPicker color={field.value} onChange={field.onChange} />
            <HexColorInput color={field.value} onChange={field.onChange}
                           className="mx-[55px] mb-0 mt-5 box-border block w-[90px] rounded border border-solid border-[#ddd] p-1.5 text-center uppercase" />
        </div>
    );
};

export default ColorPicker;
