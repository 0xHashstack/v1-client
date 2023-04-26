import Image from "next/image";
import React from "react";

const SelectButton = (props) => {
  const { style, selection, dropDownArrow, ...otherProps } = props;
  const defaultStyles = {
    width: "420px",
    margin: "5px auto",
    marginBottom: "20px",
    padding: "8px 10px",
    fontSize: "18px",
    borderRadius: "5px",
    border: "2px solid rgb(57, 61, 79)",
    fontWeight: "200",
  };
  const mergedStyles = { ...defaultStyles, ...style };

  return (
    <div style={mergedStyles} {...otherProps}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "14px",
          fontWeight: "400",
        }}
      >
        <div>&nbsp;&nbsp;{selection}</div>
        <div
          style={{
            marginRight: "20px",
            marginTop: "3px",
            marginBottom: "0",
            cursor: "pointer",
          }}
        >
          {dropDownArrow && (
            <Image
              src={dropDownArrow}
              alt="Picture of the author"
              width="14px"
              height="14px"
            />
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default SelectButton;
