import React from 'react';


const Dashboard = React.lazy(() => import('./components/Layout/dashboard'));
const Sellers = React.lazy(() => import('./components/Layout/sellers'));
const Customers = React.lazy(() => import('./components/Layout/customers'));
const Orders = React.lazy(() => import('./components/Layout/orders'));
const ContactUs = React.lazy(() => import('./components/Layout/contactUs'));
const RegisterSeller = React.lazy(() => import('./components/Layout/sellers/register-seller/register-seller'));
const EditSeller = React.lazy(() => import('./components/Layout/sellers/editSeller/editSeller'));
const SellerDetails = React.lazy(() => import('./components/Layout/sellers/sellerDetails/sellerDetails'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/sellers', name: 'Sellers', component: Sellers },
  { path: '/seller-details/:sellerId', name: 'SellerDetails', component: SellerDetails },
  { path: '/edit-seller/:sellerId', name: 'EditSeller', component: EditSeller },
  { path: '/register-seller', name: 'RegisterSellers', component: RegisterSeller },
  { path: '/customers', name: 'Customers', component: Customers },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/Contact-us', name: 'ContactUs', component: ContactUs },
];

export default routes;
