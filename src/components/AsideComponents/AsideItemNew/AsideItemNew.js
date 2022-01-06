import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { gql, useMutation } from '@apollo/client'

// Styling import
import tw from 'twin.macro'
import styled from 'styled-components'

// Redux Action
import { newItemCreated } from '../../../redux/actions/itemAction'

// Components
import { CompleteTag } from '../../index'

// Mui icon
import { Close, KeyboardArrowDown } from '@mui/icons-material'

const AsideItemNew = ({ setIsNewItemOpen, isNewItemOpen }) => {
  const dispatch = useDispatch()

  const initialInput = {
    title: '',
    body: '',
    typeCategory: '',
  }
  const [newItem, setNewItem] = useState(initialInput)
  const [cateKey, setCateKey] = useState([])
  const [isDrop, setIsDrop] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  const categoryList = useSelector((state) => state.categoryList)
  const { allCategory } = categoryList

  const [saveNewItem] = useMutation(CREATE_NEW_ITEM, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
    update(_, { data: { createItem } }) {
      console.log(createItem)
      dispatch(newItemCreated(createItem))

      setNewItem({ title: '', body: '', typeCategory: '' })
      setIsComplete(true)
    },
    onError(err) {
      console.log(err)
    },
    variables: newItem,
  })

  const getCategoryType = () => {
    if (allCategory && allCategory.length > 0) {
      const getCateType = allCategory.reduce((total, type) => {
        const { typeCategory } = type

        if (!typeCategory) return total

        if (!total[typeCategory]) {
          total[typeCategory] = { cateType: typeCategory }
        }

        return total
      }, {})

      setCateKey(Object.keys(getCateType))
    }
  }

  const handleCreateNewItem = async () => {
    if (
      newItem.title !== '' &&
      newItem.body !== 'undefined' &&
      newItem.typeCategory !== ''
    ) {
      saveNewItem()
    }
  }

  useEffect(() => {
    if (isNewItemOpen) {
      getCategoryType()
    }
  }, [isNewItemOpen])

  return (
    <AsideItemNewContainer
      className={`${isNewItemOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="inner-box">
        <CompleteTag
          body={'New Item Added'}
          setIsComplete={setIsComplete}
          isComplete={isComplete}
        />

        <h1>Add a new item</h1>

        <div className="input-box">
          <small>Name</small>
          <input
            type="text"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            placeholder="Tomato"
          />
        </div>
        <div className="input-box">
          <small>Note</small>
          <textarea
            type="text"
            rows="4"
            cols="50"
            value={newItem.body}
            onChange={(e) => setNewItem({ ...newItem, body: e.target.value })}
            placeholder="Any info about the item"
          />
        </div>
        <div className="input-box">
          <small>Category</small>
          <div className="drop-input-box">
            <input
              type="text"
              className="option-input"
              value={newItem.typeCategory}
              onChange={(e) =>
                setNewItem({ ...newItem, typeCategory: e.target.value })
              }
              placeholder="Item Category"
            />
            {allCategory && allCategory.length > 0 && !isDrop && (
              <KeyboardArrowDown
                onClick={() => setIsDrop(true)}
                className="icon"
              />
            )}
            {isDrop && (
              <Close onClick={() => setIsDrop(false)} className="icon" />
            )}
          </div>
          <div
            onMouseLeave={() => setIsDrop(false)}
            className={`drop-menu ${isDrop && 'active'}`}
          >
            {cateKey &&
              cateKey.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setNewItem({ ...newItem, typeCategory: item })}
                  className="drop-option"
                >
                  {item}
                </div>
              ))}
          </div>
        </div>

        <div className="item-btn-box">
          <div className="btn can-btn" onClick={() => setIsNewItemOpen(false)}>
            Cancel
          </div>
          <div className="btn save-btn" onClick={() => handleCreateNewItem()}>
            Save
          </div>
        </div>
      </div>
    </AsideItemNewContainer>
  )
}

const CREATE_NEW_ITEM = gql`
  mutation createItem($title: String!, $body: String!, $typeCategory: String!) {
    createItem(
      itemInput: { title: $title, body: $body, typeCategory: $typeCategory }
    ) {
      id
      typeCategory
      items {
        id
        title
        body
        numPick
      }
      numPick
      createdAt
    }
  }
`

const AsideItemNewContainer = styled.div`
  ${tw`
    absolute
    top-0
    right-0
    h-full
    p-10
    bg-white

    transition-all
    duration-500
    ease-in-out
  `}

  .inner-box {
    ${tw`
      relative
      flex
      flex-col
      items-start
      justify-start
      w-full
      h-full
      overflow-y-scroll
      scrollbar-hide
    `}
  }

  h1 {
    ${tw`
        mb-6
        text-lg
        md:text-xl
        font-semibold
    `}
  }

  .input-box {
    ${tw`
      relative
      flex
      flex-col
      mb-4
      w-full
    `}

    small {
      ${tw`
        mb-1
        text-sm
        font-semibold
        text-gray-700
      `}
    }

    input,
    textarea {
      ${tw`
        py-3
        px-4
        w-full
        font-semibold
        border-2
        border-gray-400
        rounded-xl

        transition
        duration-200
        ease-in-out
      `}

      &:focus {
        ${tw`
            outline-none
            border-yellow-500
        `}
      }
    }

    textarea {
      resize: none;
    }

    .drop-input-box {
      ${tw`
        relative
        w-full
      `}

      .option-input {
        ${tw`
          pr-8
        `}
      }

      .icon {
        ${tw`
          absolute
          right-3
          top-[50%]
          w-8
          h-8
          p-1
          rounded-full
          translate-y-[-50%]
          cursor-pointer

          transition
          duration-200
          ease-in-out
        `}

        &:hover {
          ${tw`
            bg-gray-300
          `}
        }
      }
    }

    .drop-menu {
      ${tw`
        mt-2
        h-0
        max-h-[15rem]
        w-full
        bg-white
        rounded-xl
        overflow-y-scroll
        scrollbar-hide

        transition-all
        duration-500
        ease-in-out
      `}

      .drop-option {
        ${tw`
          py-2
          px-5
          text-gray-600
          font-semibold
          rounded-xl
          cursor-pointer

          transition-all
          duration-200
          ease-in-out
        `}

        &:hover {
          ${tw`
            text-gray-900
            bg-gray-300
          `}
        }
      }
    }

    .drop-menu.active {
      ${tw`
        p-2
        h-auto
        border-2
        border-gray-400
      `}
    }
  }

  .item-btn-box {
    ${tw`
        flex
        items-center
        justify-between
        mt-auto
        w-full
    `}

    .btn {
      ${tw`
        w-full
        py-2
        text-lg
        text-center
        font-semibold
        rounded-xl
        cursor-pointer

        transition
        duration-200
        ease-in-out
      `}
    }

    .can-btn {
      &:hover {
        ${tw`
            bg-gray-300
        `}
      }
    }

    .save-btn {
      ${tw`
        text-gray-50
        bg-yellow-500
      `}

      &:hover {
        ${tw`
            bg-opacity-80
            shadow-md
        `}
      }
    }
  }
`

export default AsideItemNew
