import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from './AuthContext'

const PrivateRouter = ({ children }) => {
  let {user} = useContext(AuthContext)


  return (
    user ? children : (<Navigate to='/' />)
  )
}
export default PrivateRouter