import "./App.css";
import { Toggle } from "./components/Toggle/Index";
import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { useForm } from "react-hook-form";
import { ApexOptions } from "apexcharts";
import { Axios } from "axios";

interface formSubmit {
  Tamb: number;
  T0: number;
  T1: number;
  t1: number;
}
function App() {
  const axiosInstance = new Axios({baseURL: 'http://localhost:4001'})

  const resolveTemperature = (
    Tamb: number,
    T0: number,
    T1: number,
    t1: number,
    t: number
  ) => {
    let k = Math.log((T1 - Tamb) / (T0 - Tamb)) / t1;
    k = Math.round(k * 100) / 100;
    setConstantK(k);
    return Tamb + (T0 - Tamb) * Math.E ** (k * t);
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
    console.log(coolingData);
    return coolingData;
  };

  const [coolingData, setCoolingData] = useState<{ x: number; y: number }[]>([]);
  const [constantK, setConstantK] = useState<number | null>(null);

  const { handleSubmit, register, setValue } = useForm<formSubmit>();

  const options: ApexOptions = {
    colors: ["#12AAFF", "#002d47"],

    xaxis: {
      categories: coolingData.map((value) => value.x),
      tickAmount: 24,
    },

    yaxis: [
      {
        seriesName: "Temperatura",
        title: {
          text: "Temperatura",
        },
      },
    ],
  };

  const series: ApexOptions['series'] = [
    {
      name: "Temperatura",
      type: "line",
      data: coolingData,
    }
  ];

  const updateChartData = (data: formSubmit) => {
    const { Tamb, T0, T1, t1 } = data;
    const newData = generateCoolingData(Number(Tamb), Number(T0), Number(T1), Number(t1))
    setCoolingData(newData);
  };

  const getDataFromSensors = async (): Promise<{Tamb: number, T: number, date: Date}> => {
    const { data } = await axiosInstance.get('/tempValue')
    const { Tamb, T, date } = JSON.parse(data);
    return { Tamb: Number(Tamb), T: Number(T), date: new Date(date)}
  }

  const getTempDataAuto = async() => {
    const data = await getDataFromSensors();
    setValue('Tamb', data.Tamb);
    setValue('T0', data.T);
  }

  return (
    <main>
      <header className="App-header">
        <h1>
          <span>S</span>KADI
        </h1>
      </header>
      <article>
        <form onSubmit={handleSubmit(updateChartData)}>
          <div className="input-div">
            <div className="LabelInput">
              <label>Temperatura Ambiente</label>
              <input step="0.1" {...register('Tamb', { required: true })} type="number" />
            </div>

            <div className="LabelInput">
              <label>Temperatura Inicial</label>
              <input step="0.1" {...register('T0', { required: true })} type="number" />
            </div>

            <div className="LabelInput">
              <label>Temperatura Próximo Instante</label>
              <input step="0.1" {...register('T1', { required: true })} type="number" />
            </div>

            <div className="LabelInput">
              <label>Instante da Leitura</label>
              <input step="0.1" {...register('t1', { required: true })} type="number" />
            </div>

            <p>K: {constantK}</p>
          </div>
          <div className="btn-div">
              <button onClick={getTempDataAuto}>Buscar dados</button>
              <button type="submit">Gerar Gráfico</button>
            </div>
        </form>
        <div className="chart">
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
