import "./App.css";
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
  const delay = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });

  const axiosInstance = new Axios({ baseURL: "http://localhost:4001" });

  const resolveTemperature = (
    Tamb: number,
    T0: number,
    T1: number,
    t1: number,
    t: number
  ) => {
    let k = Math.log((T1 - Tamb) / (T0 - Tamb)) / t1;
    setConstantK(Math.round(k * 10000) / 10000);
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

  const [coolingData, setCoolingData] = useState<{ x: number; y: number }[]>(
    []
  );
  const [constantK, setConstantK] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // setInterval(setIsLoading, 5_000, !isLoading) // Teste do loading
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

  const series: ApexOptions["series"] = [
    {
      name: "Temperatura",
      type: "line",
      data: coolingData,
    },
  ];

  const updateChartData = (data: formSubmit) => {
    const { Tamb, T0, T1, t1 } = data;
    const newData = generateCoolingData(
      Number(Tamb),
      Number(T0),
      Number(T1),
      Number(t1)
    );
    setCoolingData(newData);
  };

  const getDataFromSensors = async (): Promise<{
    Tamb: number;
    T: number;
    date: Date;
  }> => {
    try {
      const { data } = await axiosInstance.get("/tempValue");
      const { Tamb, T, date } = JSON.parse(data);
      return { Tamb: Number(Tamb), T: Number(T), date: new Date(date) };
    } catch (error) {
      alert("Erro ao buscar dados dos sensores, verifique a conexão!");
      throw error;
    }
  };

  const getTempDataAuto = async () => {
    setIsLoading(true);
    const data = await getDataFromSensors();
    setValue("Tamb", data.Tamb);
    setValue("T0", data.T);

    while (true) {
      await delay(5000);
      try {
        const newData = await getDataFromSensors();
        console.log(data, newData);
        if (data.T - newData.T > 1.5) {
          setValue("T1", newData.T);
          setValue("t1", Math.round((newData.date.getTime() - data.date.getTime()) / 1000));
          setIsLoading(false)
          break;
        }
      } catch (error) {
        setIsLoading(false)
        console.error(error);
        break;
      }
    }
  };

  return (
    <main>
      <header className="App-header">
        <div id="container" >
          <svg viewBox="0 0 100 100" style={{ display: isLoading ? "flex" : "none" }} >
            <defs>
              <filter id="shadow">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="1.5"
                  flood-color="#FFFF"
                />
              </filter>
            </defs>
            <circle id="spinner" cx="50" cy="50" r="45" />
          </svg>
        </div>
        <h1>
          <span>S</span>KADI
        </h1>
      </header>
      <article>
        <form onSubmit={handleSubmit(updateChartData)}>
          <div className="input-div">
            <div className="LabelInput">
              <label>Temperatura Ambiente</label>
              <input
                step="0.1"
                {...register("Tamb", { required: true })}
                type="number"
              />
            </div>

            <div className="LabelInput">
              <label>Temperatura Inicial</label>
              <input
                step="0.1"
                {...register("T0", { required: true })}
                type="number"
              />
            </div>

            <div className="LabelInput">
              <label>Temperatura Próximo Instante</label>
              <input
                step="0.1"
                {...register("T1", { required: true })}
                type="number"
              />
            </div>

            <div className="LabelInput">
              <label>Instante da Leitura</label>
              <input
                step="0.1"
                {...register("t1", { required: true })}
                type="number"
              />
            </div>

            <p id="constantK">K: {constantK}</p>
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
