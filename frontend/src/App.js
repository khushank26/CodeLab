import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './components/Auth';
import Problem from './components/Prob_list';
import NotFound from './components/Not_found';
import ProbDetail from './components/Prob_detail';
import PrivateRouter from './utility/private_router';
import { AuthProvider } from './utility/AuthContext';

function App() {
  return (
    <Router>
      {/*If you render things without path, they will appear on every path*/}

      <AuthProvider>
        
          <Routes>

            <Route element={<Auth />} path="/" />   {/* You can use component={Auth} also */}

            <Route element={<PrivateRouter><Problem /></PrivateRouter>} path="/problems" />
            <Route element={<PrivateRouter><ProbDetail /></PrivateRouter>} path="/problem/:id" />
            {/* <Route path="heroes/:id" element={} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        
      </AuthProvider>

    </Router>
  );
}

export default App;
