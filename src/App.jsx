import RemoveKeyForm from "./components/RemoveKeyForm.jsx";
import GetKeyMode from "./components/GetKeyMode.jsx";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  // here we create an array state to store the contact form data
  return (
      <Router>
        <Routes>
          <Route exact path='/removeKey' element={<RemoveKeyForm/>}></Route>
          <Route exact path='/getKeyMode' element={<GetKeyMode/>}></Route>
        </Routes>
      </Router>
  );
}

export default App;