import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { gql, useLazyQuery } from '@apollo/client'
import moment from 'moment'

// Styling import
import tw from 'twin.macro'
import styled from 'styled-components'

// Redux Action
import { getItemInfoNOpen } from '../../redux/actions/itemAction'

// mui icons
import { KeyboardBackspace, EventNote } from '@mui/icons-material'

const HistorySingle = ({ handleToggleView, listId }) => {
  const dispatch = useDispatch()
  const [selectedItem, setSelectedItem] = useState({
    cateId: '',
    itemId: '',
    category: '',
  })

  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  const itemInfo = useSelector((state) => state.itemInfo)
  const { item } = itemInfo

  const [getSelectedList, { data, loading, error }] = useLazyQuery(
    GET_SINGLE_LIST,
    {
      context: {
        headers: {
          Authorization: `Bearer${' '}${user.token}`,
        },
      },
    }
  )

  const [getItemInfo, { data: itemData }] = useLazyQuery(GET_ITEM_INFO, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
    fetchPolicy: 'no-cache',
  })

  const handleItemClick = (cateId, itemId, typeCategory) => {
    setSelectedItem({ cateId, itemId, category: typeCategory })

    // Check is the item already in redux
    if (item && item.id === itemId) {
      dispatch(getItemInfoNOpen({ getItemInfo: { ...item } }, typeCategory))
    } else {
      getItemInfo({ variables: { cateId, itemId } })
    }
  }

  // Filter item by category and return components
  const getItemCategories = (itemList) => {
    if (itemList.length > 0) {
      const getCateType = itemList.reduce((acc, item) => {
        const { cateType } = item

        if (!cateType) return acc

        if (!acc[cateType]) {
          acc[cateType] = { name: cateType }
        }

        return acc
      }, {})

      return (
        <div className="scroll-box">
          {Object.values(getCateType).map((x, i) => (
            <div key={i} className="item-box">
              <h2>{x.name}</h2>
              <div className="grid-container">
                {itemList
                  .filter((item) => item.cateType === x.name)
                  .map((item) => (
                    <div
                      key={item.itemId}
                      className="item-card"
                      onClick={() =>
                        handleItemClick(item.cateId, item.itemId, item.cateType)
                      }
                    >
                      <h3>{item.title}</h3>
                      <span className="item-qty">{item.qty} pcs</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    return
  }

  useEffect(() => {
    if (listId) {
      getSelectedList({ variables: { listId } })
    }
  }, [listId])

  // UseEffect to get item info
  useEffect(() => {
    if (itemData) {
      console.log(itemData)
      dispatch(
        getItemInfoNOpen(itemData, selectedItem.cateId, selectedItem.category)
      )
    }
  }, [itemData])

  return (
    <HSContainer>
      <div onClick={() => handleToggleView()} className="back-btn">
        <KeyboardBackspace className="back-icon" />
        back
      </div>
      {error && <div className="err-title">Seem like there an error</div>}
      {!loading && data && (
        <div className="list-container">
          <div className="list-title">{data.getSingleList.title}</div>
          <div className="list-date">
            <EventNote className="icon" />
            <span>
              {moment(data.getSingleList.createdAt).format('ddd m.M.YYYY')}
            </span>
          </div>
          {getItemCategories(data.getSingleList.items)}
        </div>
      )}
    </HSContainer>
  )
}

const GET_SINGLE_LIST = gql`
  query getSingleList($listId: ID!) {
    getSingleList(listId: $listId) {
      id
      title
      items {
        itemId
        cateId
        title
        qty
        cateType
        isComplete
      }
      isComplete
      isCancelled
      createdAt
    }
  }
`

const GET_ITEM_INFO = gql`
  query getItemInfo($cateId: String!, $itemId: String!) {
    getItemInfo(cateId: $cateId, itemId: $itemId) {
      id
      title
      body
    }
  }
`

const HSContainer = styled.div`
  ${tw`
    flex
    flex-col
    w-full
    py-14
    px-6
    md:px-20
    bg-white
  `}
  flex: 0 0 100%;

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

  .list-container {
    ${tw`
      flex
      flex-col
      h-full
      w-full
    `}
  }

  .err-title,
  .list-title {
    ${tw`
      mt-6
      md:mt-8
      text-xl
      md:text-2xl
      font-semibold
      text-gray-900
    `}
  }

  .list-date {
    ${tw`
      flex
      items-center
      justify-start

      mt-4
      mb-10
      text-gray-500
    `}

    .icon {
      ${tw`
        mr-2
      `}
    }

    span {
      ${tw`
        font-semibold
      `}
    }
  }

  .scroll-box {
    ${tw`
      flex
      flex-col
      flex-grow
      w-full
      overflow-y-scroll
      scrollbar-hide
    `}
  }

  .item-box {
    ${tw`
      w-full
      mt-8
    `}

    h2 {
      ${tw`
        text-base
        md:text-lg
        font-semibold
        text-gray-800
      `}
    }

    .grid-container {
      ${tw`
        grid
        grid-cols-2
        md:grid-cols-3
        xl:grid-cols-4
        gap-4
        w-full
        mt-2
      `}

      .item-card {
        ${tw`
          flex
          items-center
          justify-between
          p-3
          bg-white
          shadow-md
          rounded-md
        `}

        h3 {
          ${tw`
            text-sm
            md:text-base
            flex-grow
            font-semibold
            text-gray-800
            cursor-pointer
          `}
        }

        .item-qty {
          ${tw`
            text-xs
            md:text-sm
            text-yellow-500
            font-semibold
          `}
        }
      }
    }
  }
`

export default HistorySingle
