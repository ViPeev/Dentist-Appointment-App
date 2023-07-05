import { router } from "./Router";
import { RouterProvider } from "react-router-dom";

function App(): JSX.Element {
  return (
    <div className="App box-border">
      <RouterProvider router={router} />
    </div>
  );
}
export default App;
