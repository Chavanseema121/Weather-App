import './App.css';
import Country from './Country';
import WeatherTable from './WeatherTable';
import {Routes,Route} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" Component={WeatherTable}></Route>
        <Route path="/:name" Component={Country}></Route>
      </Routes> 
    </div>
  );
}

export default App;
