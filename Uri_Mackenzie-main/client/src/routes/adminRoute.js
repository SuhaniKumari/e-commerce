import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const AdminRoute = ({children}) => {
  //  If User Logged in
  const { token, user } = useSelector((state)=>state.user);

  //  Send to my profile If Logged In
  if(!token || user.userType !== 'Admin'){
    return <Navigate to="/login" />
  }

  //  Act normally if it's not logged in
  return children
}

export default AdminRoute