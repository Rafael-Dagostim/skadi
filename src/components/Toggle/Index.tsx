import './style.css'

type ToggleProps = {
  handleToggleUpdate: React.Dispatch<React.SetStateAction<boolean>>,
}

export const Toggle = ({ handleToggleUpdate }: ToggleProps) => {
  return (
    <label className="switch">
      <input type="checkbox" onChange={(e) => handleToggleUpdate(e.target.checked)} />
      <span className="slider round"></span>
    </label>
  )
}