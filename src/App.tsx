import "./App.css";
import { Toggle } from "./components/Toggle/Index";
import { useState } from "react";
import { Dashboard } from "./components/Dashboard";

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
    let k = Math.log((T1 - Tamb) / (T0 - Tamb)) / t1;
    k = Math.round(k * 100) / 100;
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

  const [Tamb, setAmbientTemperature] = useState<number>(20);

  const [T0, setInitialTemperature] = useState<number>(100);

  const [t1, setFirstInstant] = useState<number>(5);

  const [T1, setFirstInstantTemperature] = useState<number>(90);

  const [coolingData, setCoolingData] = useState<{ x: number; y: number }[]>(
    generateCoolingData(Tamb, T0, T1, t1)
  );

  const options = {
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

  const series = [
    {
      name: "Temp",
      type: "line",
      data: coolingData,
    },
  ];

  return (
    <main>
      <header className="App-header">
        <h1>
          <span>S</span>KADI
        </h1>
      </header>
      <article>
        <aside>
          <div className="LabelInput">
            <label>Leitura Automática</label>
            <Toggle />
          </div>

          <div className="LabelInput">
            <label>Temperatura Ambiente</label>
            <input
              type="number"
              onChange={(e: any) =>
                setAmbientTemperature(Number(e.target.value))
              }
            />
          </div>

          <div className="LabelInput">
            <label>Temperatura Inicial</label>
            <input
              type="number"
              onChange={(e: any) =>
                setInitialTemperature(Number(e.target.value))
              }
            />
          </div>

          <div className="LabelInput">
            <label>1º Instante</label>
            <input
              type="number"
              onChange={(e: any) => setFirstInstant(Number(e.target.value))}
            />
          </div>

          <div className="LabelInput">
            <label>Temperatura 1º Instante</label>
            <input
              type="number"
              onChange={(e: any) =>
                setFirstInstantTemperature(Number(e.target.value))
              }
            />
          </div>
          <div className="btn-div">
            <button>Gerar Gráfico</button>
          </div>
        </aside>
        <div className='Teste'>
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
