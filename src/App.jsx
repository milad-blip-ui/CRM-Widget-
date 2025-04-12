import React, { useContext, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from "./layout/AppLayout";
import { AppContext } from './context/AppContext';
import { Toaster } from 'react-hot-toast';
import {AppSpinner,PageSpinner} from './components/shared/Spinner';

//estimate imports
// Import EstimatesContext
import { EstimatesProvider } from './context/EstimateContext';
import Estimate from './pages/Estimate/Index';
import EstimateDetail from './pages/Estimate/Details';
import EstimateCreate from './pages/Estimate/Create';
import EstimateEdit from './pages/Estimate/Edit';
import EstimateRevise from './pages/Estimate/Revise';


//sales order imports
import Salesorder from './pages/Salesorder/Index';
import SalesorderDetail from './pages/Salesorder/Details'
import Designorder from './pages/Designorder/Design'
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
          <Route path="/" element={
            <EstimatesProvider>
              <Estimate />
            </EstimatesProvider>
          } />
          <Route path="/es-create" element={
            <EstimatesProvider>
              <EstimateCreate />
            </EstimatesProvider>
          } />
          <Route path="/es-details/:id" element={
            <EstimatesProvider>
              <EstimateDetail />
            </EstimatesProvider>
          } />
          <Route path="/es-edit/:id" element={
            <EstimatesProvider>
              <EstimateEdit />
            </EstimatesProvider>
          } />
          <Route path="/es-revise/:id" element={
            <EstimatesProvider>
              <EstimateRevise />
            </EstimatesProvider>
          } />
        {/* Other routes do not have access to EstimatesProvider */}
        <Route path="/so" element={<Salesorder />} />
        <Route path="/so-details/:id" element={<SalesorderDetail />} />
        <Route path="/do" element={<Designorder />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;