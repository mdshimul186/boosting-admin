import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import Articles from 'src/views/article';
import LoginView from 'src/views/auth/LoginView';
import RegisterView from 'src/views/auth/RegisterView';
import CaterogyList from 'src/views/category';
import CustomerListView from 'src/views/customer/CustomerListView';
import NotFoundView from 'src/views/errors/NotFoundView';
import OrderList from 'src/views/order';
import ProductListView from 'src/views/product';
import DashboardView from 'src/views/reports/DashboardView';
import SettingsView from 'src/views/settings/SettingsView';
import LayoutSetting from 'src/views/SiteLayoutSetting';
import Freelancers from './views/freelancers';
import OurWorks from './views/ourworks';

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
