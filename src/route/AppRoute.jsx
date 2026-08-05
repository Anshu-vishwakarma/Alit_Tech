import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
 import Dashboard from "../dashboard/Dashboard"
import SignUp from '../sign-up/SignUp'
import SignIn from '../sign-in/SignIn'
import InvoiceForm from '../invoice/Invoice'
import NewItemDialog from '../Item/NewItemDialog'
import ItemsTable from '../Item/ItemsTable'

const AppRoute = () => {
    return (
        <Routes>
            <Route path="Items" element={<ItemsTable />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="SignUp" element={<SignUp />} />
            <Route path="SignIn" element={<SignIn />} />
            <Route path="Invoice" element={<InvoiceForm />} />
            <Route path="" element={<Navigate to="SignIn" replace />} />
        </Routes>
    )
}

export default AppRoute