import React, { useEffect, useState } from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

// Redux
import { useSelector } from 'react-redux'

import { LoginForm } from '../../components/index'

// Svg
import DeliverySvg from '../../assets/LoginSvg/Delivery.svg'
import OptionSvg from '../../assets/LoginSvg/Options.svg'
import PaymentSvg from '../../assets/LoginSvg/Payment.svg'
// Mui
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

const LoginSliderData = [
  {
    id: 1,
    image: OptionSvg,
    title: 'Still thinking on what to eat?',
    body: 'At Foodie, there variaty of favour for you to pick! No same old taste from yor surrounding restaurant.',
  },
  {
    id: 2,
    image: DeliverySvg,
    title: 'We are SPEED, and reliable',
    body: 'We may not as fast as light, but we will make sure your order are delivered in expected time and hot!',
  },
  {
    id: 3,
    image: PaymentSvg,
    title: 'Fast and Secure Payment',
    body: 'We have partner with most secure payment vendor to secure your infomation.',
  },
]

const Login = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)

  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  useEffect(() => {
    if (user) navigate('/shopping-list-client')
  }, [user, navigate])

  useEffect(() => {
    const lastIndex = LoginSliderData.length - 1

    if (currentIndex < 0) {
      setCurrentIndex(lastIndex)
    }

    if (currentIndex > lastIndex) {
      setCurrentIndex(0)
    }
  }, [currentIndex, LoginSliderData])

  useEffect(() => {
    let slider = setInterval(() => {
      setCurrentIndex(currentIndex + 1)
    }, 8000)

    //run one time after one
    return () => clearInterval(slider)
  }, [currentIndex])

  return (
    <LoginContainer>
      <div className="inner-container">
        <div className="login-container">
          <LoginForm />
        </div>

        <div className="promote-container">
          {LoginSliderData &&
            LoginSliderData.map((x, index) => {
              const { id, image, title, body } = x

              let position = 'nextSlideV'
              if (currentIndex === index) {
                position = 'activeSlideV'
              }

              if (
                currentIndex === index - 1 ||
                (index === 0 && currentIndex === LoginSliderData.length - 1)
              ) {
                position = 'lastSlideV'
              }

              return (
                <div className={`slider-card ${position}`} key={id}>
                  <img src={image} alt="slider-img" />
                  <h1>{title}</h1>
                  <p>{body}</p>
                </div>
              )
            })}
          <div className="slider-dot-container">
            {LoginSliderData &&
              LoginSliderData.map((x, index) => (
                <div
                  key={index}
                  className={`dot ${currentIndex === index && 'active'}`}
                />
              ))}
            <div className="slider-arrow-container">
              <KeyboardArrowLeft
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="arrow-icon"
              />
              <KeyboardArrowRight
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="arrow-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </LoginContainer>
  )
}

const LoginContainer = styled.div`
  ${tw`
    flex
    items-center
    justify-center
    h-screen
    w-screen
    overflow-hidden
  `}

  .inner-container {
    ${tw`
      flex
      items-start
      justify-center
      mx-auto
      py-14
      h-full
      w-full
      max-w-3xl
    `}

    .login-container {
      ${tw`
        flex
        items-center
        justify-center
        py-6
        h-full
        w-full
        max-w-sm
        bg-white
      `}
    }

    .promote-container {
      ${tw`
        relative
        hidden
        md:inline-flex
        h-full
        w-full
        overflow-hidden
      `}

      .slider-card {
        ${tw` 
          absolute
          top-0
          left-0
          flex-col
          items-center
          justify-center
          p-6
          h-full
          w-full
          bg-yellow-100

          transition-all
          duration-200
          ease-in-out
        `}

        img {
          ${tw`
            mx-auto
            w-60
            object-cover
          `}
        }

        h1 {
          ${tw`
            mt-2
            mb-3
            text-xl
            md:text-2xl
            font-semibold
          `}
        }
      }

      .slider-dot-container {
        ${tw`
          absolute
          left-0
          bottom-0
          w-full
          px-6
          pb-3
          flex
          items-center
          justify-start
        `}

        .dot {
          ${tw`
            w-3
            h-3
            mr-3
            bg-gray-400
            bg-opacity-50
            rounded-full

            transition-all
            duration-200
            ease-in-out
        `}
        }

        .dot.active {
          ${tw`
            bg-yellow-400
          `}
        }

        .slider-arrow-container {
          ${tw`
            ml-auto
            flex
            items-center
            justify-center
          `}

          .arrow-icon {
            ${tw`
              p-1
              mx-2
              w-8
              h-8
              text-yellow-500
              border
              border-yellow-500
              rounded-md
              cursor-pointer

              transition
              duration-200
              ease-in-out
            `}

            :hover {
              ${tw`
                bg-yellow-100
              `}
            }
          }
        }
      }
    }
  }

  .activeSlideV {
    opacity: 1;
    transform: translateX(0);
  }

  .lastSlideV {
    opacity: 0;
    transform: translateX(-100%);
  }

  .nextSlideV {
    opacity: 0;
    transform: translateX(100%);
  }
`

export default Login
