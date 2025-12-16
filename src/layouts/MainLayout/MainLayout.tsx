import { useState } from 'react';
import AppHeader from '../../components/Header/Header';
import AppSidebar from '../../components/Sidebar/Sidebar';
import clsx from "clsx";
import './MainLayout.css';
import { Outlet } from 'react-router-dom';


const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="home-page-container">
            <AppSidebar collapsed={collapsed} />

            <main className={clsx("main-home-page", { collapsed })}>
                <AppHeader
                    onToggleSidebar={() => setCollapsed(!collapsed)}
                />
                <div className='page-content'>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default MainLayout;