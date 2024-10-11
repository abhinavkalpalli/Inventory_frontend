import { lazy,Suspense } from "react";
import {Routes,Route} from 'react-router-dom'
import PrivateUserRoutes from "./privateUserRoutes";

const Dashboard=lazy(()=>import('../components/Dashboard'))
const Products=lazy(()=>import('../components/Products'))
const Customers=lazy(()=>import('../components/Customers'))
const DashboardLayout=lazy(()=>import('../components/DashboardLayout'))
const SalesReportPage=lazy(()=>import('../components/SalesReport'))
const Loader=lazy(()=>import('../components/Loader/Loader'))
const Header=lazy(()=>import('../components/Header'))



function userRoutes() {
  return (
    <>
        <Suspense fallback={<Loader/>}>
          <Routes>
            <Route element={<PrivateUserRoutes/>}>
        <Route element={<DashboardLayout/>}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/customers" element={<Customers/>} />
          <Route path="/salesReport" element={<SalesReportPage/>} />
          </Route>
          </Route>
          </Routes>
          
        </Suspense>
      </>
  )
}

export default userRoutes
