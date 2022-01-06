import tw from 'twin.macro'
import styled from 'styled-components'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Guestlayout from './utils/GuestLayout'
import PrivateRoute from './utils/PrivateRoute'

// Redux
import { useSelector } from 'react-redux'

// Pages & components
import { HomePage, LoginPage, HistoryPage, ErrorPage } from './pages/index'
import { Navbar, AsideList } from './components/index'

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache({
      addTypename: false,
    }),
    // uri: 'http://192.168.98.59:4000/graphql',
    uri: 'https://ray-shopping-list-api.herokuapp.com/graphql',
  })

  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  const baseUrl = 'shopping-list-client/'

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <MainContainer>
          {user && <Navbar />}

          {/* Wraping all children route  */}
          <Routes path="/" element={<Guestlayout />}>
            <Route path={`${baseUrl}login`} element={<LoginPage />} />

            <Route
              path={`${baseUrl}`}
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />

            <Route
              path={`${baseUrl}history`}
              element={
                <PrivateRoute>
                  <HistoryPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          {user && <AsideList />}
        </MainContainer>
      </BrowserRouter>
    </ApolloProvider>
  )
}

// Testing New PC Push Github

const MainContainer = styled.div`
  ${tw`
    relative
    flex
    items-start
    justify-between
    w-screen
    h-screen
    bg-gray-200
    bg-opacity-80
    overflow-hidden
  `}
`

export default App
