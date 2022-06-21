import './style.css'

export const Toggle = () => {
  return (
    <label className="switch">
      <input type="checkbox" />
      <span className="slider round"></span>
    </label>
  )
}