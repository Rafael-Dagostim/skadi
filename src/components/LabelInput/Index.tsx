import React from "react";

import './style.css';

type LabelInputProps = {
  type: 'number' | 'checkbox',
  label: string,
}

export const LabelInput = ({ type, label }: LabelInputProps) => {
  return (
    <div className="LabelInput">
      <label>{label}</label>
      <input type={type} />
    </div>
  )
}
