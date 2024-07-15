import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { CreateCollection } from "@/pages/CreateCollection";
import { MyCollections } from "@/pages/MyCollections";
import Workflows from "@/pages/Workflows";
import Agents from "@/pages/Agents";
import Marketplace from "@/pages/Marketplace";
import Profile from "@/pages/Profile";
import LandingPage from "./pages/Landing";
import AgentExecution from "./pages/AgentExecution";

function Layout() {
  return (
    <>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "create-collection",
        element: <CreateCollection />,
      },
      {
        path: "my-collections",
        element: <MyCollections />,
      },
      {
        path: "workflows",
        element: <Workflows />,
      },
      {
        path: "agents",
        element: <Agents />,
      },
      {
        path: "agent/:agentId",
        element: <AgentExecution />,
      },
      {
        path: "marketplace",
        element: <Marketplace />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
