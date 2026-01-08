export const selectStyles = {
    control: (base, state)=>({
        ...base,
        backgroundColor: "#0f0f0f",
        borderColor: state.isFocused ? "#4f46e5": "#333",
        boxShadow: `none`,
        minHeight: 38,
        height: 38,
        cursor: `pointer`,
    }),
    valueContainer: (base)=>({
        ...base,
        padding: `2px`,
    }),
    singleValue: (base)=>({
        ...base,
        color: `#fff`
    }),
    menu:(base, state)=>({
        ...base,
        width: `100%`,
        backgroundColor: state.isSelected 
        ? `#4f46e5`
        : state.isFocused
        ? `#222`
        : `black`,
        borderRadius: `5px`,
        overflow: `hidden`,
        color: `#000`,
        cursor: `pointer`
    }),
    indicatorSeperator: ()=>({
        display: `none`
    }),
    dropdownIndicator: (base)=>({
        ...base,
        padding: 4,
        display:`none`, 
        color: `#888`
    })
}