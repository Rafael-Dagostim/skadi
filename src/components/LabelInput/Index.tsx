import React from "react";

type LabelInputProps = {
  type: 'number' | 'checkbox',
  label: string,
}

export const LabelInput = ({ type, label }: LabelInputProps) => {
  return (
    <div>
      <label>{label}</label>
      <input type={type} />
    </div>
  )
}
