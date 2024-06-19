import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  //  If User Logged in
  const { isLogin } = useSelector((state) => state.user);

  //  Send to my profile If Logged In
  if (!isLogin) {
    return <Navigate to="/login" />
  }

  //  Act normally if it's not logged in
  return children
}

export default ProtectedRoute