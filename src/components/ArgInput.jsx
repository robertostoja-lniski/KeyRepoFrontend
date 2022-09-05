import { useState } from "react";
import "./ArgInput.css";

const ArgInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, ...inputProps } = props;

  return (
    <div className="argInput">
      <label>{label}</label>
      <input
        {...inputProps}
        onChange={onChange}
        onBlur={() => setFocused(true)}
        onFocus={() => setFocused(false)}
        focused={focused.toString()}
      />
      <span>{errorMessage}</span>
    </div>
  );
};

export default ArgInput;