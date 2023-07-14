import { router } from "./Router";
import { RouterProvider } from "react-router-dom";
import store from "./features/store";
import { Provider } from "react-redux";

function App(): JSX.Element {
  return (
    <div className="App box-border">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </div>
  );
}
export default App;
