import { createBrowserRouter, NavLink, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Homepage from "./homepage";
import ProductDetail from "./product";
import Admin from "./admin";
import SellerProfile from "./sellerProfile";
import "./root.css";
import { FaHome } from "react-icons/fa";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { connectWallet } from "../util/contract";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

// This client will be used to manage and cache asynchronous queries throughout the application.
const queryClient = new QueryClient();
const accountAtom = atomWithStorage("account", "");
const tokenAtom = atomWithStorage("token", "");

export const Root = () => {
  const [account, setAccount] = useAtom(accountAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const handleWalletConnection = async () => {
    try {
      const { account } = await connectWallet();
      setAccount(account);
    } catch (error) {
      console.error(error?.message);
    }
  };

  const handleTokenConnection = async () => {
   try {
      const { token } = await connectWallet();
      setToken(token);
    } catch (error) {
      console.error(error?.message);
    }
  };

  window?.ethereum?.on("accountsChanged", (accounts) => {
    const account = accounts?.length > 0 ? accounts[0] : "";
    setAccount(account);
  });

  return (
    <header>
      <nav className="top-nav-section">
        <div className="connect-wallet">
          <button className="button-53" onClick={handleWalletConnection}>
            <strong>Connect Wallet</strong>
          </button>
          <span style={{ marginRight: 20 }}></span>

          <strong> {account} </strong>
        </div>
        <NavLink to="/homepage" className="home-button">
          <FaHome size={18} style={{ marginRight: 5 }} />
          <strong>Home Page</strong>
        </NavLink>
        <NavLink
          to="/admin"
          style={({ isActive }) =>
            isActive ? { color: "white" } : { color: "black" }
          }
        >
          <strong> Admin </strong>
        </NavLink>
      
      </nav>
      <Outlet />
    </header>
  );
};

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <QueryClientProvider client={queryClient}>
        <Root />
      </QueryClientProvider>
    ),
    children: [
      {
        path: "homepage",
        element: <Homepage />,
      },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "product/:productID", // Add a route for ProductDetail.
        element: <ProductDetail />,
      },
      {
        path: "sellerProfile/:sellerID",
        element: <SellerProfile />,
      },
      {
        path: "*", // Redirect to homepage if no route matches.
        element: <Homepage />,
      },
    ],
  },
]);
