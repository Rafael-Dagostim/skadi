import { LabelInput } from "./components/LabelInput/Index";

import "./App.css";
import ApexCharts from "apexcharts";

function App() {
  const resolveTemperature = (Tamb: number, T0: number, T1: number, t1: number, t: number) => {
    let k = Math.log((T1 - Tamb) / (T0 - Tamb)) / t1
    k = Math.round(k * 100) / 100
    return Tamb + ((T0 - Tamb) * (Math.E ** (k * t)))
  }

  const resolveInstant = (Tamb: number, T0: number, T1: number, t1: number, T: number) => {
    let k = Math.log((T1 - Tamb) / (T0 - Tamb)) / t1
    k = Math.round(k * 100) / 100
    return -Math.log((T - Tamb) / (T0 - Tamb)) / -k
  }


  const Tamb = 20;
  const T0 = 60;
  const T1 = 56;
  const t1 = 2;

  const renderCoolingChart = (Tamb: number, T0: number, T1: number, t1: number) => {
    let k = Math.log((T1 - Tamb) / (T0 - Tamb)) / t1
    k = Math.round(k * 100) / 100
    const coolingData: {x: number, y: number}[] = []

   
    let i = 1;
    while (resolveTemperature(Tamb, T0, T1, t1, i) > Tamb + 1) {
      coolingData.push({x: i, y: Math.round(resolveTemperature(Tamb, T0, T1, t1, i) * 100) / 100})
      i += 1;
    }
    console.log(coolingData)
    var options = {
      chart: {
        type: 'line'
      },
      series: [{
        name: 'Ambiente',
        data: Tamb
      },{
        name: 'Resfriamento do Objeto',
        data: coolingData
      }],
      xaxis: {
        type: 'numeric'
      }
    }

    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
  }

  return (
    <main>
      <header className="App-header">
        <h1>
          <span>S</span>KADI
        </h1>
      </header>
      <article>
        <aside>
          <LabelInput type="checkbox" label="Leitura Automática" />
          <LabelInput type="number" label="Temperatura Ambiente" />
          <LabelInput type="number" label="Temperatura Inicial" />
          <LabelInput type="number" label="1º Instante" />
          <LabelInput type="number" label="Temperatura 1º Instante" />
          <div className="btn-div">
            <button onClick={() => {renderCoolingChart(Tamb, T0, T1, t1)}}>Gerar Gráfico</button>
          </div>
        </aside>
        <div id="chart"></div>
      </article>
      <footer>
        <p>Desenvolvido por Rafael Dagostim</p>
      </footer>
    </main>
  );
}

export default App;
