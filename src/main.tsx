import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import "./app/index.css"
import { StoreContext } from './app/context/StoreContext.tsx'
import brandStore from './enteties/card/store/brandStore.ts';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StoreContext.Provider value={{brandStore}}>
    <App/>
  </StoreContext.Provider>  
);
