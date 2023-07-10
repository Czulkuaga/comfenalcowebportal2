import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

//Import Routes App
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <AppRoutes/>
      <ToastContainer />
    </>
  );
}

export default App;
