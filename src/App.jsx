import React, { useContext, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from "./layout/AppLayout";
import { AppContext } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import {PageSpinner} from './components/shared/Spinner';

//estimate imports
// Import EstimatesContext
import Estimate from './pages/Index';
import EstimateDetail from './pages/Details';
import EstimateCreate from './pages/Create';
import EstimateEdit from './pages/Edit';
import EstimateRevise from './pages/Revise';

function App() {
  const { loading } = useContext(AppContext);
 //const [loading, setLoading] = useState(false);
  if (loading) {
    return <PageSpinner />;
  }

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route element={<AppLayout />}>
          {/* Wrap only estimate-related routes with the EstimatesProvider */}
          <Route path="/" element={ <Estimate />} />
          <Route path="/es-create" element={<EstimateCreate />} />
          <Route path="/es-details/:id" element={<EstimateDetail />} />
          <Route path="/es-edit/:id" element={<EstimateEdit />} />
          <Route path="/es-revise/:id" element={<EstimateRevise />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;