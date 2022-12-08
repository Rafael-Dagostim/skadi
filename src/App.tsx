import { useState } from "react";
import { getTemperatureOnInstant } from "./utils/get_temperature_on_instant";

import "./App.css";

import { Dashboard, DashboardProps } from "./components/Dashboard";
import { FormSubmit, InputForm } from "./components/InputForm";
import { resolveKConstant } from "./utils/resolve_k_constant";


function App() {
  const [constantK, setConstantK] = useState<number | null>(null);
  const [coolingData, setCoolingData] = useState<DashboardProps['coordinateValues']>([]);

  const handleSubmit = (data: FormSubmit) => {
    const { ambientTemperature, initialTemperature, firstInstantTemperature, firstInstantValue } = data;
    const newCoolingData: DashboardProps['coordinateValues'] = [];
    debugger
    let currentTemperatureValue = Number(initialTemperature);
    while (currentTemperatureValue > Number(ambientTemperature) + 1) {
      currentTemperatureValue = getTemperatureOnInstant(
        Number(ambientTemperature),
        Number(initialTemperature),
        Number(firstInstantTemperature),
        Number(firstInstantValue),
        newCoolingData.length + 1
      )
      newCoolingData.push({
        x: newCoolingData.length + 1,
        y: Number(currentTemperatureValue.toFixed(2))
      });
    }

    const K = resolveKConstant(
      ambientTemperature,
      initialTemperature,
      firstInstantTemperature,
      firstInstantValue
    )

    setConstantK(K)

    setCoolingData(newCoolingData);

    console.log(newCoolingData)
  };
  return (
    <>
      <header>
        <h1>
          <span>S</span>KADI
        </h1>
      </header>
      <main>
        <aside>
          <InputForm onValid={handleSubmit} />
          {!!constantK && <p id="constantK">K: {constantK}</p>}
        </aside>
        <article className="dashboard-container">
          {!!coolingData && <Dashboard coordinateValues={coolingData}></Dashboard>}
        </article>
      </main>
      <footer>
        <p >Desenvolvido por Rafael Dagostim</p>
      </footer>
    </>
  );
}

export default App;
