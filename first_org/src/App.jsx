
import { Outlet } from "react-router-dom";

import Nav from "./comp/Nav.jsx";


function App() {
  return (
    <>
      <Nav />

      <Outlet />
    </>
  );
}


export default App;

