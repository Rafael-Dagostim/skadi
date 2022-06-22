import "./App.css";
import { Toggle } from "./components/Toggle/Index";
import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { useForm } from "react-hook-form";
import { ApexOptions } from "apexcharts";

interface formSubmit {
  Tamb: number;
  T0: number;
  T1: number;
  t1: number;
}
function App() {
  const resolveTemperature = (
    Tamb: number,
    T0: number,
    T1: number,
    t1: number,
    t: number
  ) => {
    let k = Math.log((T1 - Tamb) / (T0 - Tamb)) / t1;
    k = Math.round(k * 100) / 100;
    return Tamb + (T0 - Tamb) * Math.E ** (k * t);
  };

  const resolveInstant = (
    Tamb: number,
    T0: number,
    T1: number,
    t1: number,
    T: number
  ) => {
    let k = Math.log((T1 - Tamb) / (T0 - Tamb)) / t1;
    k = Math.round(k * 100) / 100;
    return -Math.log((T - Tamb) / (T0 - Tamb)) / -k;
  };

  const generateCoolingData = (
    Tamb: number,
    T0: number,
    T1: number,
    t1: number
  ) => {
    const coolingData: { x: number; y: number }[] = [];

    let i = 1;
    while (resolveTemperature(Tamb, T0, T1, t1, i) > Tamb + 1) {
      coolingData.push({
        x: i,
        y: Math.round(resolveTemperature(Tamb, T0, T1, t1, i) * 100) / 100,
      });
      i += 1;
    }

    return coolingData;
  };

  const [automaticReading, setAutomaticReading] = useState<boolean>(false);

  const [coolingData, setCoolingData] = useState<{ x: number; y: number }[]>(
    []
  );

  const { handleSubmit, register } = useForm<formSubmit>();

  const options: ApexOptions  = {
    colors: ["#12AAFF", "#002d47"],

    xaxis: {
      categories: coolingData.map((value) => value.x),
    },

    yaxis: [
      {
        seriesName: "Temp",
        title: {
          text: "Temperatura",
        },
      },
    ],
  };

  const series: ApexOptions['series'] = [
    {
      name: "Temp",
      type: "line",
      data: coolingData,
    },
  ];

  const updateChartData = (data: formSubmit) => {
    const { Tamb, T0, T1, t1 } = data;
    const newData = generateCoolingData(Number(Tamb), Number(T0), Number(T1), Number(t1))
    console.log(newData)
    setCoolingData(newData);
  };

  return (
    <main>
      <header className="App-header">
        <h1>
          <span>S</span>KADI
        </h1>
      </header>
      <article>
        <form onSubmit={handleSubmit(updateChartData)}>
          <div className="LabelInput">
            <label>Leitura Automática</label>
            <Toggle />
          </div>

          <div className="LabelInput">
            <label>Temperatura Ambiente</label>
            <input {...register('Tamb', { required: true })} type="number" />
          </div>

          <div className="LabelInput">
            <label>Temperatura Inicial</label>
            <input {...register('T0', { required: true })} type="number" />
          </div>

          <div className="LabelInput">
            <label>Temperatura Próximo Instante</label>
            <input {...register('T1', { required: true })} type="number" />
          </div>

          <div className="LabelInput">
            <label>Valor Próximo Instante</label>
            <input {...register('t1', { required: true })} type="number" />
          </div>

          <div className="btn-div">
            <button type="submit">Gerar Gráfico</button>
          </div>
        </form>
        <div className="Teste">
          <Dashboard options={options} series={series}></Dashboard>
        </div>
      </article>

      <footer>
        <p>Desenvolvido por Rafael Dagostim</p>
      </footer>
    </main>
  );
}

export default App;
