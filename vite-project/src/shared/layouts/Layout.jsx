import { Outlet } from "react-router-dom";
import { LeftSideBar } from "./LeftSideBar";
import { TopBar } from "./TopBar";

export const Layout = () => {
  return (
    <main className="layout">
      <LeftSideBar />

      <section className="layout-content">
        <TopBar />

        <main>
          <Outlet />
        </main>
      </section>
    </main>
  );
};
