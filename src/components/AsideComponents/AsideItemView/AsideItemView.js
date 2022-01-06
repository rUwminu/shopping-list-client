import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { gql, useMutation } from '@apollo/client'

// Styling import
import tw from 'twin.macro'
import styled from 'styled-components'

// Redux Action
import {
  closeItemInfoForm,
  deleteItemFromCategory,
} from '../../../redux/actions/itemAction'
import { addItemToList } from '../../../redux/actions/listAction'

// mui icons
import { KeyboardBackspace } from '@mui/icons-material'

const AsideItemView = () => {
  const dispatch = useDispatch()

  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  const itemInfo = useSelector((state) => state.itemInfo)
  const { loading, isOpen, item } = itemInfo

  const [deleteItem] = useMutation(DELETE_ITEM, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
    update(_, { data }) {
      console.log(data)
    },
    onError(err) {
      console.log(err)
    },
  })

  const handleDeleteItem = (itemId) => {
    deleteItem({ variables: { itemId } })
    dispatch(deleteItemFromCategory(itemId))
  }

  const handleItemAdd = (cateId, itemId, title, typeCategory) => {
    const newItemAdd = {
      cateId,
      itemId,
      title,
      cateType: typeCategory,
    }
    dispatch(addItemToList(newItemAdd))
  }

  return (
    <AsideItemContainer
      className={`${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div onClick={() => dispatch(closeItemInfoForm())} className="back-btn">
        <KeyboardBackspace className="back-icon" />
        back
      </div>
      {!loading && item && (
        <div className="item-info-container">
          <div className="item-list">
            <small>name</small>
            <h2>{item.title}</h2>
          </div>
          <div className="item-list">
            <small>category</small>
            <p>{item.category}</p>
          </div>
          <div className="item-list">
            <small>note</small>
            <p>{item.body}</p>
          </div>
        </div>
      )}
      <div className="btn-container">
        <div className="btn del-btn" onClick={() => handleDeleteItem(item.id)}>
          delete
        </div>
        <div
          className="btn add-btn"
          onClick={() =>
            handleItemAdd(item.cateId, item.id, item.title, item.category)
          }
        >
          Add to list
        </div>
      </div>
    </AsideItemContainer>
  )
}

const DELETE_ITEM = gql`
  mutation deleteItem($itemId: ID!) {
    deleteItem(itemId: $itemId) {
      id
    }
  }
`

const AsideItemContainer = styled.div`
  ${tw`
    absolute
    top-0
    right-0
    flex
    flex-col
    items-start
    justify-between
    w-full
    h-full
    py-14
    px-10
    bg-white

    transition-all
    duration-500
    ease-in-out
  `}

  .back-btn {
    ${tw`
      flex
      items-center
      justify-start
      max-w-[5rem]
      py-1
      text-sm
      md:text-base
      text-yellow-400
      font-semibold
      rounded-md
      cursor-pointer

      transition-all
      duration-200
      ease-in-out
    `}

    .back-icon {
      ${tw`
        mr-2
        text-lg
        md:text-xl
      `}
    }

    &:hover {
      ${tw`
        px-2
        bg-gray-100
      `}
    }
  }

  .item-info-container {
    ${tw`
      flex-grow
      flex
      flex-col
      w-full
    `}

    .item-list {
      ${tw`
        mt-6
      `}

      small {
        ${tw`
          text-gray-500
        `}
      }

      h2 {
        ${tw`
          text-lg
          font-semibold
        `}
      }

      p {
        ${tw`
          font-semibold
        `}
      }
    }
  }

  .btn-container {
    ${tw`
      flex
      items-center
      justify-between
      w-full
    `}

    .btn {
      ${tw`
        py-2
        w-full
        text-center
        font-semibold
        rounded-md
        cursor-pointer

        transition
        duration-200
        ease-in-out
      `}
    }

    .del-btn {
      &:hover {
        ${tw`
          bg-gray-200
        `}
      }
    }

    .add-btn {
      ${tw`
        bg-yellow-600
        text-gray-50
      `}

      &:hover {
        ${tw`
          bg-opacity-90
          shadow-md
        `}
      }
    }
  }
`

export default AsideItemView
