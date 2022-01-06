import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { gql, useMutation, useQuery } from '@apollo/client'

// Styling import
import tw from 'twin.macro'
import styled from 'styled-components'

// mui icon
import { Edit } from '@mui/icons-material'

// Redux Action
import {
  setCreateList,
  setResetEdit,
  setClearActiveList,
} from '../../../redux/actions/listAction'

// Components
import ItemCard from './ItemCard'
import AsideItemView from '../AsideItemView/AsideItemView'
import AsideItemNew from '../AsideItemNew/AsideItemNew'
import { CompleteTag } from '../../index'

const AsideList = () => {
  const dispatch = useDispatch()

  const [getList, setGetList] = useState({
    newTitle: 'Shopping list',
  })
  const [typeCategory, setTypeCategory] = useState()
  const [isNewItemOpen, setIsNewItemOpen] = useState(false)
  const [isTitleEdit, setIsTitleEdit] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  const itemInfo = useSelector((state) => state.itemInfo)
  const { isOpen } = itemInfo

  const listItem = useSelector((state) => state.listItem)
  const { activeList, isListOpen } = listItem

  const { data } = useQuery(GET_ACTIVE_LIST, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
  })

  const [createNewList] = useMutation(CREATE_NEW_LIST, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
    update(_, { data: { createList } }) {
      dispatch(setCreateList(createList))
    },
    onError(err) {
      console.log(err)
    },
    variables: {
      title: getList.newTitle,
      items: activeList.items,
    },
  })

  const [updateListInfo] = useMutation(UPDATE_INFO_LIST, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
    update(_, { data: updateList }) {
      //console.log(updateList)
      setIsTitleEdit(false)
      setIsComplete(true)
      dispatch(setResetEdit())
      dispatch(setCreateList(updateList.updateList))
    },
    onError(err) {
      console.log(err)
    },
  })

  const [toggleCancelList] = useMutation(CANCEL_ACTIVE_LIST, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
    update(_, { data: toggleCancelList }) {
      dispatch(setClearActiveList())
      setTypeCategory([])
      setGetList({
        newTitle: 'Shopping list',
      })
    },
    onError(err) {
      console.log(err)
    },
  })

  const [updateListComplete] = useMutation(UPDATE_COMPLETE_LIST, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
    update(_, { data: updateCompleteList }) {
      dispatch(setClearActiveList())
      setTypeCategory([])
      setGetList({
        newTitle: 'Shopping list',
      })
    },
    onError(err) {
      console.log(err)
    },
  })

  const getItemCategories = () => {
    if (activeList.items && activeList.items.length > 0) {
      const getCateType = activeList.items.reduce((acc, item) => {
        const { cateType } = item

        if (!cateType) return acc

        if (!acc[cateType]) {
          acc[cateType] = { name: cateType }
        }

        return acc
      }, {})

      setTypeCategory(Object.values(getCateType))
    }

    return
  }

  const handleCreateList = () => {
    createNewList()
  }

  const handleTitleChange = (e) => {
    setGetList({ ...getList, newTitle: e.target.value })
    setIsTitleEdit(true)
  }

  const handleSaveChange = () => {
    if (activeList.isEdit && isTitleEdit) {
      updateListInfo({
        variables: {
          listId: activeList.id,
          newTitle: getList.newTitle,
          newItems: activeList.items,
        },
      })
    } else if (activeList.isEdit) {
      updateListInfo({
        variables: {
          listId: activeList.id,
          newTitle: '',
          newItems: activeList.items,
        },
      })
    } else if (isTitleEdit) {
      updateListInfo({
        variables: {
          listId: activeList.id,
          newTitle: getList.newTitle,
        },
      })
    }
  }

  const handleCancelList = () => {
    toggleCancelList({ variables: { listId: activeList.id } })
  }

  const handleCompleteList = () => {
    updateListComplete({ variables: { listId: activeList.id } })
  }

  useEffect(() => {
    if (data && data.getActiveList) {
      dispatch(setCreateList(data.getActiveList))
    }
  }, [data])

  useEffect(() => {
    if (activeList && activeList.items.length > 0) {
      getItemCategories()
      setGetList({
        ...getList,
        newTitle: activeList.title,
      })
    }
  }, [activeList])

  return (
    <AsideContainer
      className={`${isOpen || isListOpen ? 'active' : 'disactive'}`}
    >
      <CompleteTag
        body={'Save Complete!'}
        setIsComplete={setIsComplete}
        isComplete={isComplete}
      />
      <div className="inner-container">
        <AsideAddItemContainer>
          <div className="list-new-item-box">
            <h2>Didn't find what you need?</h2>
            <div className="add-btn" onClick={() => setIsNewItemOpen(true)}>
              Add item
            </div>
          </div>
        </AsideAddItemContainer>
        {activeList && activeList.items && (
          <AsideListItemContainer>
            <div className="title-container">
              <input
                type="text"
                value={getList.newTitle}
                className={`h1 ${isTitleEdit && 'active'}`}
                onChange={(e) => handleTitleChange(e)}
              />
              <div className="title-edit-box">
                <div
                  className="edit-box"
                  onClick={() => setIsTitleEdit(!isTitleEdit)}
                >
                  <Edit className="icon" />
                </div>
                <div
                  className={`edit-btn ${
                    (activeList.isEdit || isTitleEdit) && 'active'
                  }`}
                  onClick={() => handleSaveChange()}
                >
                  Save
                </div>
              </div>
            </div>

            <div className="item-list-container">
              {typeCategory &&
                typeCategory.map((x, index) => (
                  <div key={index} className="list-box">
                    <small>{x.name}</small>
                    <ItemCard type={x.name} />
                  </div>
                ))}
            </div>
          </AsideListItemContainer>
        )}
        {!activeList.title && (
          <AsideCreateListContainer>
            <div
              className={`input-box ${
                activeList &&
                activeList.items &&
                activeList.items.length > 0 &&
                'active'
              }`}
            >
              <input
                type="text"
                value={getList.newTitle}
                onChange={(e) =>
                  setGetList({ ...getList, newTitle: e.target.value })
                }
                required
              />
              <div className="save-btn" onClick={() => handleCreateList()}>
                Save
              </div>
            </div>
          </AsideCreateListContainer>
        )}
        {activeList.title && (
          <AsideListUpdateContainer>
            <div className="btn can-btn" onClick={() => handleCancelList()}>
              Cancel
            </div>
            <div className="btn com-btn" onClick={() => handleCompleteList()}>
              Complete
            </div>
          </AsideListUpdateContainer>
        )}

        {/* Absolute Slide-In Components */}
        <AsideItemView />
        <AsideItemNew
          setIsNewItemOpen={setIsNewItemOpen}
          isNewItemOpen={isNewItemOpen}
        />
      </div>
    </AsideContainer>
  )
}

const GET_ACTIVE_LIST = gql`
  query GetActiveList {
    getActiveList {
      id
      title
      items {
        cateId
        itemId
        title
        cateType
        qty
        isComplete
      }
      isComplete
    }
  }
`

const CREATE_NEW_LIST = gql`
  mutation createList($title: String!, $items: [CartInput!]) {
    createList(listInput: { title: $title, items: $items }) {
      id
      title
      items {
        cateId
        itemId
        title
        cateType
        qty
        isComplete
      }
      isComplete
    }
  }
`

const UPDATE_INFO_LIST = gql`
  mutation updateList(
    $listId: String!
    $newTitle: String
    $newItems: [CartInput]
  ) {
    updateList(
      updateListInput: {
        listId: $listId
        newTitle: $newTitle
        newItems: $newItems
      }
    ) {
      id
      title
      items {
        cateId
        itemId
        title
        cateType
        qty
        isComplete
      }
      isComplete
    }
  }
`

const CANCEL_ACTIVE_LIST = gql`
  mutation toggleCancelList($listId: ID!) {
    toggleCancelList(listId: $listId) {
      id
      isCancelled
    }
  }
`

const UPDATE_COMPLETE_LIST = gql`
  mutation updateCompleteList($listId: ID!) {
    updateCompleteList(listId: $listId) {
      id
      isComplete
    }
  }
`

const AsideContainer = styled.div`
  ${tw`
    absolute
    md:relative
    top-0
    right-0
    h-full
    md:max-w-sm
    bg-yellow-100
    overflow-hidden

    transition-all
    duration-500
    ease-in-out
    z-10
  `}

  .inner-container {
    ${tw`
      relative
      flex
      flex-col
      items-start
      justify-between
      w-full
      h-full
      overflow-y-scroll
      scrollbar-hide
    `}
  }

  &.active {
    width: calc(100% - 3.5rem);
  }

  &.disactive {
    ${tw`
      w-0
      md:w-full
    `}
  }
`

const AsideAddItemContainer = styled.div`
  ${tw`
    flex
    flex-col
    items-start
    justify-between
    w-full
    pt-10
    px-10
  `}

  .list-new-item-box {
    ${tw`
      flex
      flex-col
      w-full
      py-4
      px-6
      bg-red-900
      bg-opacity-90
      rounded-2xl
      overflow-hidden

      transition-all
      duration-200
      ease-in-out
    `}

    h2 {
      ${tw`
        mb-2
        md:text-lg
        font-semibold
        text-gray-100
      `}
    }

    .add-btn {
      ${tw`
        py-2
        w-28
        text-sm
        md:text-base
        text-center
        bg-gray-100
        font-semibold
        rounded-xl
        cursor-pointer
      `}
    }
  }
`

const AsideListItemContainer = styled.div`
  ${tw`
    flex
    flex-col
    h-full
    w-full
    pt-8
    px-10
  `}

  .title-container {
    ${tw`
      w-full
      flex
      items-center
      justify-between
    `}

    input {
      ${tw`
        w-full
        text-lg
        md:text-xl
        font-semibold
        bg-transparent
        pointer-events-none
      `}

      &::placeholder {
        ${tw`
          text-gray-900
        `}
      }

      &:focus {
        ${tw`
          outline-none
        `}
      }
    }

    .h1.active {
      ${tw`
        px-2
        border-2
        border-yellow-500
        bg-gray-50
        rounded-xl
        pointer-events-auto
      `}
    }

    .title-edit-box {
      ${tw`
        flex
        items-center
        justify-start
      `}

      .edit-box {
        ${tw`
          flex
          items-center
          justify-center
          w-10
          h-10
          p-2
          rounded-full
          cursor-pointer

          transition
          duration-200
          ease-in-out
        `}

        .icon {
          ${tw`
            w-full
            h-full
            pointer-events-none
          `}
        }

        &:hover {
          ${tw`
            bg-gray-200
          `}
        }
      }

      .edit-btn {
        ${tw`
          w-0
          h-0
          text-yellow-500
          font-semibold
          border-yellow-500
          overflow-hidden
          rounded-2xl
          pointer-events-none

          transition-all
          duration-200
          ease-in-out
        `}
      }

      .edit-btn.active {
        ${tw`
          h-auto
          w-auto
          px-4
          border-2
          cursor-pointer
          pointer-events-auto
        `}

        &:hover {
          ${tw`
            bg-yellow-500
            text-gray-50
          `}
        }
      }
    }
  }

  .item-list-container {
    ${tw`
      h-full
      max-h-[20rem]
      overflow-y-scroll
      scrollbar-hide
    `}
  }

  .list-box {
    ${tw`
      flex
      flex-col
      w-full
      mt-6
    `}

    small {
      ${tw`
        font-semibold
        text-gray-600
      `}
    }
  }
`

const AsideCreateListContainer = styled.div`
  ${tw`
    w-full
    py-4
    px-10
    bg-white
  `}

  .input-box {
    ${tw`
      relative
      w-full
      pointer-events-none
    `}

    input {
      ${tw`
        w-full
        py-2
        pl-4
        pr-20
        border-2
        border-gray-400
        rounded-xl
      `}

      &:focus {
        ${tw`
          outline-none
        `}
      }
    }

    .save-btn {
      ${tw`
        absolute
        top-0
        right-0
        px-3
        h-full
        flex
        items-center
        justify-center
        bg-gray-400
        text-gray-50
        font-semibold
        rounded-xl
        cursor-pointer
        pointer-events-none
        rounded-xl

        transition-all
        duration-200
        ease-in-out
      `}
    }
  }

  .input-box.active {
    ${tw`
      pointer-events-auto
    `}

    input {
      ${tw`
        border-yellow-500
      `}
    }

    .save-btn {
      ${tw`
        bg-yellow-500
        pointer-events-auto
      `}

      &:hover {
        ${tw`
          bg-opacity-80
        `}
      }
    }
  }
`

const AsideListUpdateContainer = styled.div`
  ${tw`
    flex
    items-center
    justify-center
    w-full
    py-4
    px-10
    bg-white
  `}

  .btn {
    ${tw`
      flex
      items-center
      justify-center
      w-full
      py-3
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
        bg-gray-200
      `}
    }
  }

  .com-btn {
    ${tw`
      text-gray-50
      bg-yellow-500
    `}

    &:hover {
      ${tw`
        bg-opacity-80
      `}
    }
  }
`

export default AsideList
