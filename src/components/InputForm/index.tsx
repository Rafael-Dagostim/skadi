import { SubmitHandler, useForm } from "react-hook-form";

import './style.css';

export interface FormSubmit {
  ambientTemperature: number;
  initialTemperature: number;
  firstInstantTemperature: number;
  firstInstantValue: number;
}

interface InputFormProps {
  onValid: SubmitHandler<FormSubmit>
}

export const InputForm = ({ onValid }: InputFormProps) => {

  const { handleSubmit, register } = useForm<FormSubmit>();

  return (
    <form onSubmit={handleSubmit(onValid)}>
      <div className="form-container">
        <div className="input-container">
          <label>Temperatura Ambiente</label>
          <input
            step="0.1"
            {...register('ambientTemperature', { required: true })}
            type="number"
          />
        </div>

        <div className="input-container">
          <label>Temperatura Inicial</label>
          <input
            step="0.1"
            {...register('initialTemperature', { required: true })}
            type="number"
          />
        </div>

        <div className="input-container">
          <label>Temperatura no Primeiro Instante</label>
          <input
            step="0.1"
            {...register('firstInstantTemperature', { required: true })}
            type="number"
          />
        </div>

        <div className="input-container">
          <label>Instante da Leitura</label>
          <input
            step="0.1"
            {...register('firstInstantValue', { required: true })}
            type="number"
          />
        </div>
      </div>
      <button type="submit">Gerar Gráfico</button>
    </form>
  )
}