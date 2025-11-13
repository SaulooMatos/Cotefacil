import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Desafio1 from './pages/Desafio1';
import Desafio2 from './pages/Desafio2';
import Desafio3 from './pages/Desafio3';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/desafio1" element={<Desafio1 />} />
        <Route path="/desafio2" element={<Desafio2 />} />
        <Route path="/desafio3" element={<Desafio3 />} />
      </Routes>
    </Router>
  );
}

export default App;
