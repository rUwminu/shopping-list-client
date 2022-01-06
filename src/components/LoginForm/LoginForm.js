import React, { useState } from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client'

// redux
import { useDispatch } from 'react-redux'
import { signin } from '../../redux/actions/userAction'

// components
import { CompleteTag } from '../index'

const LoginForm = () => {
  const dispatch = useDispatch()
  const InputState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  }
  const [inputValue, setInputValue] = useState(InputState)
  const [isError, setIsError] = useState()
  const [isRegister, setIsRegister] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const [loginUser] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      dispatch(signin(userData))
    },
    onError(err) {
      setIsError(err.graphQLErrors[0].extensions.errors)
    },
    variables: inputValue,
  })

  const [registerUser] = useMutation(REGISTER_NEW_USER, {
    update(_, { data: { register: userEmail } }) {
      if (userEmail) {
        setIsRegister(false)
        setIsComplete(true)
      }
    },
    onError(err) {
      setIsError(err.graphQLErrors[0].extensions.errors)
    },
    variables: inputValue,
  })

  const handleLogin = () => {
    setIsError({})
    loginUser()
  }

  const handleRegister = () => {
    setIsError({})
    registerUser()
  }

  return (
    <MainContainer id="style-2">
      <CompleteTag
        body={'Register Complete!'}
        setIsComplete={setIsComplete}
        isComplete={isComplete}
      />
      <h1>
        Welcome To <span>Shoppingify</span>
      </h1>
      <span className="span-title">
        Bring your shopping list
        <br />
        wherever you go!
      </span>
      {isRegister && (
        <div className="register-msg">
          Already registered a Account?{' '}
          <span onClick={() => setIsRegister(false)}>Login Here!</span>
        </div>
      )}
      {!isRegister ? <h2>Sign In!</h2> : <h2>Sign Up Now</h2>}
      {isRegister && (
        <div className="input-item">
          <input
            onChange={(e) =>
              setInputValue({ ...inputValue, username: e.target.value })
            }
            type="text"
            className="input-box"
            required
          />
          <span className="input-ph">Username</span>
        </div>
      )}
      <div className="input-item">
        <input
          onChange={(e) =>
            setInputValue({ ...inputValue, email: e.target.value })
          }
          type="text"
          className="input-box"
          required
        />
        <span className="input-ph">Email</span>
      </div>
      {isError && isError.email && (
        <div className="error-msg">{isError.email}</div>
      )}
      <div className="input-item">
        <input
          onChange={(e) =>
            setInputValue({ ...inputValue, password: e.target.value })
          }
          type="password"
          className="input-box"
          required
        />
        <span className="input-ph">Password</span>
      </div>
      {isError && isError.password && (
        <div className="error-msg">{isError.password}</div>
      )}

      {isRegister && (
        <>
          <div className="input-item">
            <input
              onChange={(e) =>
                setInputValue({
                  ...inputValue,
                  confirmPassword: e.target.value,
                })
              }
              type="password"
              className="input-box"
              required
            />
            <span className="input-ph">Confirm Your Password</span>
          </div>
          {isError && isError.confirmPassword && (
            <div className="error-msg">{isError.confirmPassword}</div>
          )}
        </>
      )}

      {!isRegister ? (
        <div onClick={() => handleLogin()} className="login-btn">
          Login
        </div>
      ) : (
        <div onClick={() => handleRegister()} className="login-btn">
          Register
        </div>
      )}

      {!isRegister && (
        <div className="register-msg">
          Don't have a Account yet?{' '}
          <span onClick={() => setIsRegister(true)}>Register Here!</span>
        </div>
      )}
    </MainContainer>
  )
}

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      username
      isAdmin
      token
    }
  }
`

const REGISTER_NEW_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
    }
  }
`

const MainContainer = styled.div`
  ${tw`
    h-full
    w-full
    max-w-md
    flex
    flex-col
    items-start
    justify-start
    p-4

    overflow-y-scroll
  `}

  h1 {
    ${tw`
        text-2xl
        lg:text-3xl
    `}

    span {
      ${tw`
        font-semibold
        text-yellow-500
      `}
    }
  }

  .span-title {
    ${tw`
        mb-2
        pt-1
        text-base
        md:text-lg
    `}
  }

  h2 {
    ${tw`
        mt-4
        text-lg
        font-semibold
    `}
  }

  .input-item {
    ${tw`
        relative
        mt-4
        w-full
        md:max-w-sm
    `}

    input {
      ${tw`
        w-full
        px-3
        py-4
        border
        border-gray-400
        rounded-md

        transition-all
        duration-200
        ease-in-out
      `}

      :focus {
        ${tw`
            outline-none
            border-gray-900
        `}
      }
    }

    span {
      ${tw`
        absolute
        left-0
        py-[14px]
        px-3
        text-lg
        font-semibold
        text-gray-600

        transition-all
        duration-200
        ease-in-out
      `}
    }

    input:focus ~ span,
    input:valid ~ span {
      ${tw`
        py-0
        top-0
        text-sm
      `}
    }
  }

  .error-msg {
    ${tw`
      text-red-500
      font-semibold
    `}
  }

  .login-btn {
    ${tw`
        mt-4
        w-full
        md:max-w-sm
        py-3
        text-lg
        text-center
        font-semibold
        text-gray-100
        bg-yellow-500
        rounded-md
        cursor-pointer

        transition-all
        duration-200
        ease-in-out
    `}

    :hover {
      ${tw`
        bg-opacity-90
      `}
    }
  }

  .register-msg {
    ${tw`
      py-1
      font-semibold
    `}

    span {
      ${tw`
        text-yellow-600
        cursor-pointer
      `}
    }
  }
`

export default LoginForm
