import React, { useState } from 'react'
import tw from 'twin.macro'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { toggleMobileListShow } from '../../redux/actions/listAction'
import { signout } from '../../redux/actions/userAction'

// Utils
import getFirstCharOfUsername from '../../utils/getFirstCharOfUsername'

// Material ui icons
import {
  ShoppingCart,
  FormatListBulleted,
  Replay,
  Addchart,
  Logout,
  AssignmentInd,
} from '@mui/icons-material'

const Navbar = () => {
  const dispatch = useDispatch()
  const [isNavItemActive, setIsNavItemActive] = useState('home')
  const [isDropMenuActive, setIsDropMenuActive] = useState(false)

  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  const listItem = useSelector((state) => state.listItem)
  const { activeList } = listItem

  return (
    <NavContainer>
      {user && (
        <>
          <div className="user-box">
            <div
              className="user-icon"
              onClick={() => setIsDropMenuActive(!isDropMenuActive)}
            >
              {getFirstCharOfUsername(user.username)}
            </div>
            <div
              className={`user-option ${isDropMenuActive && 'active'}`}
              onMouseLeave={() => setIsDropMenuActive(false)}
            >
              <h2>Option</h2>
              <div className="option-item">
                <span>Profile</span>
                <AssignmentInd className="icon" />
              </div>
              <div className="option-item" onClick={() => dispatch(signout())}>
                <span>Logout</span>
                <Logout className="icon" />
              </div>
            </div>
          </div>
          <div className="nav-links">
            <Link
              to={`/`}
              onClick={() => setIsNavItemActive('home')}
              className={`nav-item ${isNavItemActive === 'home' && 'active'}`}
            >
              <FormatListBulleted className="item-icon" />
              <span className="pop-up">Items</span>
            </Link>
            <Link
              to={`/history`}
              onClick={() => setIsNavItemActive('history')}
              className={`nav-item ${
                isNavItemActive === 'history' && 'active'
              }`}
            >
              <Replay className="item-icon" />
              <span className="pop-up">History</span>
            </Link>
            <div
              onClick={() => setIsNavItemActive('analytics')}
              className={`nav-item ${
                isNavItemActive === 'analytics' && 'active'
              }`}
            >
              <Addchart className="item-icon" />
              <span className="pop-up">Analytics</span>
            </div>
          </div>
          <div
            className="cart-box"
            onClick={() => dispatch(toggleMobileListShow())}
          >
            <ShoppingCart className="cart-icons" />
            {activeList && activeList.items && (
              <span className="cart-notify-dot">{activeList.items.length}</span>
            )}
          </div>
        </>
      )}
    </NavContainer>
  )
}

const NavContainer = styled.div`
  ${tw`
    flex
    flex-col
    items-center
    justify-between
    h-screen
    py-12
    min-w-[3.25rem]
    bg-white

    z-30
  `}

  .user-box {
    ${tw`
      relative
      flex
      items-center
      justify-center
      w-full
    `}

    .user-icon {
      ${tw`
        h-10
        w-10
        
        flex
        items-center
        justify-center
        bg-blue-400
        text-gray-50
        font-semibold
        border-2
        border-yellow-600
        rounded-full
        cursor-pointer
      `}
    }

    .user-option {
      ${tw`
        absolute
        right-0
        top-0
        w-40
        px-2
        py-3
        bg-white
        rounded-md
        opacity-0
        translate-x-[30%]
        pointer-events-none

        transition-all
        duration-500
        ease-in-out
      `}
      box-shadow: 1px 2px 23px 3px rgba(0,0,0,0.20);

      h2 {
        ${tw`
          font-semibold
          text-gray-800
        `}
      }

      .option-item {
        ${tw`
          flex
          items-center
          justify-between
          p-2
          text-gray-600
          font-semibold
          rounded-md
          cursor-pointer

          transition
          duration-200
          ease-in-out
        `}

        &:hover {
          ${tw`
            bg-gray-200
            text-gray-800
          `}
        }
      }
    }

    .user-option.active {
      ${tw`
        opacity-100
        translate-x-full
        pointer-events-auto
      `}
    }
  }

  .nav-links {
    ${tw`
      flex-grow
      flex
      flex-col
      items-center
      justify-center
      w-full
    `}

    .nav-item {
      ${tw`
        relative
        flex
        items-center
        justify-center
        my-4
        h-8
        w-full
        cursor-pointer

        transition-all
        duration-200
        ease-in-out
      `}

      .item-icon {
        ${tw`
          text-gray-700
          pointer-events-none
        `}
      }

      .pop-up {
        ${tw`
          relative
          absolute
          right-0
          px-3
          text-sm
          bg-gray-700
          text-gray-50
          font-semibold
          translate-x-2/3
          rounded-sm
          opacity-0

          transition-all
          duration-200
          ease-in-out
        `}

        &:before {
          content: '';
          ${tw`
            absolute
            top-1/2
            left-0
            h-2
            w-2
            bg-gray-700
            rounded-sm
          `}
          transform: rotate(45deg) translate(-5px, 0px);
        }
      }

      &:before {
        content: '';
        ${tw`
          absolute
          left-0
          h-full
          w-1
          opacity-0
          bg-yellow-600
          rounded-sm

          transition-all
          duration-200
          ease-in-out
        `}
      }

      &:hover {
        .pop-up {
          ${tw`
            opacity-100
            translate-x-full
          `}
        }

        &:before {
          ${tw`
            opacity-50
          `}
        }
      }
    }

    .nav-item.active {
      &:before {
        ${tw`
          opacity-100
        `}
      }
    }
  }

  .cart-box {
    ${tw`
      relative
      flex
      items-center
      justify-center
      w-8
      h-8
      p-[6px]
      bg-yellow-600
      rounded-full
      cursor-pointer

      transition-all
      duration-200
      ease-in-out
    `}

    &:hover {
      ${tw`
        bg-opacity-80
      `}
    }

    .cart-icons {
      ${tw`
        h-full
        w-full
        text-gray-50
      `}
    }

    .cart-notify-dot {
      ${tw`
        absolute
        -top-1
        -right-1
        flex
        items-center
        justify-center
        h-4
        w-4
        text-sm
        bg-red-500
        text-gray-50
        font-semibold
        rounded-sm
      `}
    }
  }
`

export default Navbar
