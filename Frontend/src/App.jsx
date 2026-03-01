import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import CreateUser from "./pages/createUser";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminHome from "./pages/admin/adminHome";
import UserHome from "./pages/user/userHome";
import CreateStore from "./pages/user/createStore";
import ViewStores from "./pages/user/viewStore";
import All from "./pages/admin/All";
import Renewal from "./pages/admin/Renewal";
import ApprovalPending from "./pages/admin/ApprovalPending";
import AmountPending from "./pages/admin/AmountPending";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Route */}
        <Route
          path="/admin/home"
          element={
            <ProtectedRoute role="admin">
              <AdminHome />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="all" />} />
          <Route path="all" element={<All />} />
          <Route path="approval-pending" element={<ApprovalPending />} />
          <Route path="renewal" element={<Renewal />} />
          <Route path="amount-pending" element={<AmountPending />} />
        </Route>
        <Route
          path="/user/create"
          element={
            <ProtectedRoute role="admin">
              <CreateUser />
            </ProtectedRoute>
          }
        ></Route>

        <Route
          path="/user/home"
          element={
            <ProtectedRoute role="user">
              <UserHome />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="create-store" />} />
          <Route path="create-store" element={<CreateStore />} />
          <Route path="view-stores" element={<ViewStores />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
