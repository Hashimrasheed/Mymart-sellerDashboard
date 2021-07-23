import React from 'react';


const Dashboard = React.lazy(() => import('./components/Layout/dashboard'));
const Brand = React.lazy(() => import('./components/Layout/products/brands'));
const OptionTypes = React.lazy(() => import('./components/Layout/products/optionTypes'));
const OptionValues = React.lazy(() => import('./components/Layout/products/optionValues'));
const Removables = React.lazy(() => import('./components/Layout/products/removables'));
const Categories = React.lazy(() => import('./components/Layout/products/categories'));
const AllProducts = React.lazy(() => import('./components/Layout/products/products'));
const AddProducts = React.lazy(() => import('./components/Layout/products/products/addProduct'));
const EditProducts = React.lazy(() => import('./components/Layout/products/products/editProduct'));
const ProductsModel = React.lazy(() => import('./components/Layout/products/products/productModel'));
const ProductsImage = React.lazy(() => import('./components/Layout/products/products/productImage'));

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
  { path: '/brands', name: 'brands', component: Brand },
  { path: '/categories', name: 'categories', component: Categories },
  { path: '/option-types', name: 'option-types', component: OptionTypes },
  { path: '/option-values', name: 'option-values', component: OptionValues },
  { path: '/removables', name: 'removables', component: Removables },
  { path: '/products', name: 'products', component: AllProducts },
  { path: '/add-products', name: 'products', component: AddProducts },
  { path: '/edit-products/:productId', name: 'products', component: EditProducts },
  { path: '/products-model/:productId', name: 'products', component: ProductsModel },
  { path: '/products-image/:productId', name: 'products', component: ProductsImage },
  { path: '/orders', name: 'orders', component: Dashboard },
  { path: '/delivered-orders', name: 'delivered-orders', component: Dashboard },
  { path: '/settings', name: 'settings', component: Sellers },
  { path: '/banners', name: 'banners', component: Sellers },
  
  { path: '/profile', name: 'profile', component: Sellers },
  { path: '/sellers', name: 'Sellers', component: Sellers },
  { path: '/seller-details/:sellerId', name: 'SellerDetails', component: SellerDetails },
  { path: '/edit-seller/:sellerId', name: 'EditSeller', component: EditSeller },
  { path: '/register-seller', name: 'RegisterSellers', component: RegisterSeller },
  { path: '/customers', name: 'Customers', component: Customers },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/Contact-us', name: 'ContactUs', component: ContactUs },
];

export default routes;
