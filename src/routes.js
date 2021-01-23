import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import CustomerListView from 'src/views/customer/CustomerListView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import Articles from 'src/views/article';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import CaterogyList from 'src/views/category'; 
import LayoutSetting from 'src/views/SiteLayoutSetting'; 
import OrderList from 'src/views/order'; 
import OurWorks from './views/ourworks';
import Freelancers from './views/freelancers';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <AccountView /> },
      { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'products', element: <ProductListView /> },
      { path: 'articles', element: <Articles /> },
      { path: 'categories', element: <CaterogyList /> },
      { path: 'orders', element: <OrderList /> },
      { path: 'ourworks', element: <OurWorks /> },
      { path: 'freelancers', element: <Freelancers /> },
      { path: 'settings', element: <SettingsView /> },
      { path: 'layoutsetting', element: <LayoutSetting /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
