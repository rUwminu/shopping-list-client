import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { gql, useLazyQuery } from '@apollo/client'

// Styling import
import tw from 'twin.macro'
import styled from 'styled-components'

// Components
import { LoaderPlaceHolder } from '../../components/index'

// Redux Action
import { getCategoryList } from '../../redux/actions/categoryAction'
import { getItemInfoNOpen } from '../../redux/actions/itemAction'
import { addItemToList } from '../../redux/actions/listAction'

// Material Icon
import { Add } from '@mui/icons-material'

const HomePage = () => {
  const dispatch = useDispatch()
  const [selectedItem, setSelectedItem] = useState({
    cateId: '',
    itemId: '',
    category: '',
  })

  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  const categoryList = useSelector((state) => state.categoryList)
  const { allCategory } = categoryList

  const itemInfo = useSelector((state) => state.itemInfo)
  const { item } = itemInfo

  const [getSelfCategory, { data, loading }] = useLazyQuery(GET_SELF_CATEGORY, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
  })

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

  const handleItemAdd = (cateId, itemId, title, typeCategory) => {
    const newItemAdd = {
      cateId,
      itemId,
      title,
      cateType: typeCategory,
    }
    dispatch(addItemToList(newItemAdd))
  }

  // UseEffect to get user category list
  useEffect(() => {
    if (!allCategory || allCategory.length === 0) {
      getSelfCategory()
    }

    if (data) {
      dispatch(getCategoryList(data))
    }
  }, [data])

  // UseEffect to get item info
  useEffect(() => {
    if (itemData) {
      dispatch(
        getItemInfoNOpen(itemData, selectedItem.cateId, selectedItem.category)
      )
    }
  }, [itemData])

  return (
    <>
      {loading ? (
        <LoaderPlaceHolder />
      ) : (
        <HomeSection>
          <h1 className="home-title">
            <span>Shoppingify </span>allows you to take your shopping list
            wherever you go
          </h1>
          <div className="category-container">
            {allCategory &&
              allCategory.map((category, index) => {
                const { id: cateId, typeCategory, items } = category

                return (
                  <CategoryList key={cateId} index={index}>
                    <h2>{typeCategory}</h2>
                    <div className="items-container">
                      {items &&
                        items.map((item) => {
                          const { id: itemId, title } = item

                          return (
                            <div className="item-card" key={itemId}>
                              <h3
                                onClick={() =>
                                  handleItemClick(cateId, itemId, typeCategory)
                                }
                              >
                                {title}
                              </h3>
                              <div
                                className="icon-box"
                                onClick={() =>
                                  handleItemAdd(
                                    cateId,
                                    itemId,
                                    title,
                                    typeCategory
                                  )
                                }
                              >
                                <Add className="add-icon" />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CategoryList>
                )
              })}
          </div>
        </HomeSection>
      )}
    </>
  )
}

const GET_SELF_CATEGORY = gql`
  {
    getSelfCategory {
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

const GET_ITEM_INFO = gql`
  query getItemInfo($cateId: String!, $itemId: String!) {
    getItemInfo(cateId: $cateId, itemId: $itemId) {
      id
      title
      body
    }
  }
`

const HomeSection = styled.div`
  ${tw`
    flex-grow
    mx-auto
    py-16
    px-6
    md:px-20
    h-full
    w-full
    max-w-6xl
    overflow-y-scroll
    scrollbar-hide
  `}

  .home-title {
    ${tw`
      text-xl
      md:text-2xl
      text-gray-800
      font-semibold
    `}

    span {
      ${tw`
        text-yellow-400
      `}
    }
  }

  .category-container {
    ${tw`
      flex
      flex-col
      items-start
      justify-start
      pt-12
      w-full
    `}
  }
`

const CategoryList = styled.div`
  ${tw`
    flex
    flex-col
    w-full
    mb-10
    opacity-0
  `}
  animation: ${(props) =>
    `fadeInFromBottom 0.5s ease-in-out forwards ${props.index / 7 + 0.5}s`};

  h2 {
    ${tw`
      text-base
      md:text-lg
      font-semibold
    `}
  }

  .items-container {
    ${tw`
      grid
      grid-cols-2
      md:grid-cols-3
      xl:grid-cols-4
      gap-4
      w-full
      mt-3
    `}

    .item-card {
      ${tw`
        flex
        items-center
        justify-between
        bg-white
        shadow-md
        rounded-md  
      `}

      h3 {
        ${tw`
          flex-grow
          py-2
          md:py-3
          pl-3
          md:pl-4
          text-sm
          md:text-base
          font-semibold
          text-gray-800
          cursor-pointer
        `}
      }

      .icon-box {
        ${tw`
          flex
          items-center
          justify-center
          w-6
          h-6
          md:w-8
          md:h-8
          p-1
          mr-4
          rounded-full
          cursor-pointer

          transition
          duration-200
          ease-in-out
        `}
        z-index: 1;

        .add-icon {
          ${tw`
            w-full
            h-full
            min-w-full
            text-gray-600
            pointer-events-none

            transition
            duration-200
            ease-in-out
          `}
        }

        &:hover {
          ${tw`
            bg-gray-200
          `}

          .add-icon {
            ${tw`
              text-gray-800
            `}
          }
        }
      }
    }
  }

  @keyframes fadeInFromBottom {
    from {
      opacity: 0;
      transform: translateY(150px);
    }
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`

export default HomePage
