
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartScreen from './screens/StartScreen';


function App() {

  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StartScreen />} />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
