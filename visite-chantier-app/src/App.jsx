import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VisiteForm from './pages/VisiteForm';
import Entreprises from './pages/Entreprises';
import Parametres from './pages/Parametres';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="visite/:id" element={<VisiteForm />} />
            <Route path="entreprises" element={<Entreprises />} />
            <Route path="parametres" element={<Parametres />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
