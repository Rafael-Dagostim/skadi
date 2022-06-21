import React from "react";
import { Toggle } from "../Toggle/Index";

import './style.css';

type LabelInputProps = {
  type: 'number' | 'checkbox',
  label: string,
}

export const LabelInput = ({ type, label }: LabelInputProps) => {
  return (
    <div className="LabelInput">
      <label>{label}</label>
      {type === 'checkbox' ? <Toggle/> : <input type={type}/> } 
    </div>
  )
}
