import { LabelInput } from "./components/LabelInput/Index";

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1><span>S</span>KADI</h1>
      </header>
      <article>
        <aside>
          <LabelInput type="checkbox" label="Leitura Automática" />
          <LabelInput type="number" label="Temperatura Ambiente" />
          <LabelInput type="number" label="Temperatura Inicial" />
          <LabelInput type="number" label="1º Instante" />
          <LabelInput type="number" label="Temperatura 1º Instante" />
          <button>Gerar Gráfico</button>
        </aside>
        <canvas></canvas>
      </article>
    </div>
  );
}

export default App;
