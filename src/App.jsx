import RemoveKeyForm from "./components/RemoveKeyForm.jsx";
import GetKeyMode from "./components/GetKeyMode.jsx";
import GetPrivateKey from "./components/GetPrivateKey.jsx";
import CreateKey from "./components/CreateKey.jsx";
import SetKeyMode from "./components/SetKeyMode.jsx"
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  // here we create an array state to store the contact form data
  return (
      <Router>
        <Routes>
          <Route exact path='/createKey' element={<CreateKey/>}></Route>
          <Route exact path='/removeKey' element={<RemoveKeyForm/>}></Route>
          <Route exact path='/getKeyMode' element={<GetKeyMode/>}></Route>
          <Route exact path='/setKeyMode' element={<SetKeyMode/>}></Route>
          <Route exact path='/getPrivateKey' element={<GetPrivateKey/>}></Route>
        </Routes>
      </Router>
  );
}

export default App;