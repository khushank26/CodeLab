import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({ children }) => {
  /* callback function  so it gets called one time only, Lazy Initialisation*/
  let [AuthTokens, setAuthTokens] = useState(() => (localStorage.getItem('AuthTokens') ? JSON.parse(localStorage.getItem('AuthTokens')) : null))
  let [user, setUser] = useState(() => (localStorage.getItem('AuthTokens') ? jwtDecode(localStorage.getItem('AuthTokens')) : null))
  let [loading, setLoading] = useState(true)


  const [error, serError] = useState('')
  const navigate = useNavigate()
  /* async as we need to wait for some network calls and e means event*/
  // we add e which means event handler as we are gonna give this info onSumbit or onClick which is an event
  const registerUser = async (e) => {
    e.preventDefault()
    let response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        'username': e.target.username.value,
        'email': e.target.email.value,
        'password': e.target.password.value,
        'confirm_password': e.target.confirm_password.value

      })
    })
    let data = await response.json()
    console.log('data', data)
    console.log('hello')
    console.log('response', response)
    if (response.status === 201) {
      let response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'

        },
        body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })

      })
      let data = await response.json()
      console.log('data', data)
      console.log('response', response)

      if (response.status === 200) {
        setAuthTokens(data)
        setUser(jwtDecode(data.access))
        localStorage.setItem('AuthTokens', JSON.stringify(data))
        navigate('/problems')
      } else {
        alert('Invalid Credentials')
      }







      console.log("User Created")

    } else {
      console.log(response.status);
      console.log("there was a server issue");
      alert("Something went wrong")
      navigate("/")

    }
  }





  let loginUser = async (e) => {
    e.preventDefault()
    let response = await fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })

    })
    let data = await response.json()
    console.log('data', data)
    console.log('response', response)

    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwtDecode(data.access))
      localStorage.setItem('AuthTokens', JSON.stringify(data))
      navigate('/problems')
    } else {
      alert('Invalid Credentials')
    }
  }

  let UpdateAuthToken = async () => {

    let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify({ 'refresh': AuthTokens.refresh })
    })
    let data = await response.json()
    console.log('data', data)
    console.log('response', response)
    if (response.status === 200) {
      setAuthTokens(data)
      setUser(jwtDecode(data.access))
      localStorage.setItem('AuthTokens', JSON.stringify(data))
    } else {
      logoutUser()
    }

  }

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
    let interval = setInterval(() => {
      if (AuthTokens) {
        UpdateAuthToken()
      }
    }, 240000) // 24000ms is 4 minutes
    return () => clearInterval(interval)
  }, [AuthTokens, loading]);


  let logoutUser = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.removeItem('AuthTokens')
    navigate('/')
  }

  let contextData = {
    user: user,
    AuthTokens: AuthTokens,
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser
  }

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  )
}