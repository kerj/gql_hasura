import { Display } from "./components/Display";

const url = 'http://localhost:3000/customers'
function App() {
  return (
    <div className="App">
      <Display url={url} />
    </div>
  );
}

export default App;
