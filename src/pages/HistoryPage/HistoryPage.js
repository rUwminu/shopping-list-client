import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { gql, useLazyQuery } from '@apollo/client'
import moment from 'moment'
import { useLocation } from 'react-router-dom'

// Components
import HistorySingle from './HistorySingle'
import { LoaderPlaceHolderHis } from '../../components/index'

// Styling import
import tw from 'twin.macro'
import styled from 'styled-components'

// Mui icons
import { ArrowForwardIos, EventNote } from '@mui/icons-material'

const Month = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const HistoryPage = () => {
  const location = useLocation()

  const sliderRef = useRef()
  const [listArr, setListArr] = useState([])
  const [isView, setIsView] = useState(false)
  const [selectedItem, setSelectedItem] = useState()

  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  const [getUserSelfList, { data, loading }] = useLazyQuery(GET_SELF_LIST, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
  })

  const handleToggleView = (value) => {
    setIsView(!isView)

    if (!isView) {
      setSelectedItem(value)
    }

    //sliderRef.current.style.transform = `translateX(-100%)`
  }

  useEffect(() => {
    getUserSelfList()
  }, [location.pathname])

  useEffect(() => {
    if (data && !loading) {
      const tempArr = [...data.getSelfList]
      const formatDataByGroup = tempArr.reduce((acc, obj) => {
        var [y, m, d] = obj.createdAt.split('T')[0].split(/\D/)
        ;[y, m, '0' + Math.ceil(d / 7)]
          .reduce((a, v, i) => a[v] || (a[v] = i < 2 ? {} : []), acc)
          .push(obj)
        return acc
      }, {})

      const formatObjToArr = Object.keys(formatDataByGroup).map((key) => {
        const objArr = []
        const temp = formatDataByGroup[key]

        Object.keys(temp).forEach((keyy) =>
          objArr.push({
            month: Month[parseInt(keyy) - 1],
            items: [].concat.apply([], Object.values(temp[keyy])),
          })
        )

        const newYearObj = {
          year: Number(key),
          groupByMonth: objArr,
        }

        return newYearObj
      })

      setListArr(formatObjToArr)
    }
  }, [data])

  return (
    <>
      {loading ? (
        <LoaderPlaceHolderHis />
      ) : (
        <HistorySection ref={sliderRef}>
          <div
            className="temp-container"
            style={{
              transform: `${isView ? 'translateX(-100%)' : 'translateX(0%)'}`,
            }}
          >
            <HistoryContainer>
              <h1 className="history-title">Shopping History</h1>
              <div className="list-container">
                {listArr && listArr.length > 0 ? (
                  listArr.map((x, index) => {
                    const { year, groupByMonth } = x

                    return (
                      <div key={index} className="list-card">
                        {groupByMonth.map((m, i) => {
                          const { month, items } = m

                          return (
                            <GroupContainer key={i} index={i}>
                              <h2 className="group-title">
                                {month} {year}
                              </h2>
                              <div className="card-container">
                                {items.map((item) => (
                                  <div key={item.id} className="list-card">
                                    <div className="left-box">
                                      <h2 className="left-title">
                                        {item.title}
                                      </h2>
                                      <div className="date-box">
                                        <EventNote className="icon" />
                                        <p>
                                          {moment(item.createdAt).format(
                                            'ddd m.M.YYYY'
                                          )}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="right-box">
                                      <div
                                        className={`status-box ${
                                          item.isCancelled
                                            ? 'cancel-box'
                                            : item.isComplete
                                            ? 'complete-box'
                                            : 'notcom-box'
                                        }`}
                                      >
                                        {item.isCancelled
                                          ? 'Cancelled'
                                          : item.isComplete
                                          ? 'Completed'
                                          : 'Not Complete'}
                                      </div>
                                      <div
                                        className="view-box"
                                        onClick={() =>
                                          handleToggleView(item.id)
                                        }
                                      >
                                        <ArrowForwardIos className="icon" />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </GroupContainer>
                          )
                        })}
                      </div>
                    )
                  })
                ) : (
                  <div className="empty-container">
                    <span>Seem like empty here. Nothing on your mind?.</span>
                  </div>
                )}
              </div>
            </HistoryContainer>
            <HistorySingle
              handleToggleView={handleToggleView}
              listId={selectedItem}
            />
          </div>
        </HistorySection>
      )}
    </>
  )
}

const GET_SELF_LIST = gql`
  {
    getSelfList {
      id
      title
      isComplete
      isCancelled
      createdAt
    }
  }
`

const HistorySection = styled.div`
  width: 100%;
  height: inherit;
  overflow: hidden;

  .temp-container {
    ${tw`
      transition-all
      duration-700
      ease-in-out
    `}
    display: flex;
    width: 100%;
    height: inherit;
  }
`

const HistoryContainer = styled.div`
  ${tw`
    py-16
    px-6
    md:px-20

    transition-all
  `}
  flex: 0 0 100%;

  .absolute-div {
    ${tw`
      absolute
      top-0
      left-0
      w-full
      h-full
      bg-red-200
    `}
  }

  .history-title {
    ${tw`
      text-xl
      md:text-2xl
      text-gray-800
      font-semibold
    `}
  }

  .list-container {
    ${tw`
      flex
      flex-col
      items-start
      justify-start
      pt-12
      w-full
      h-full     

      overflow-y-scroll
      scrollbar-hide
    `}

    .list-card {
      ${tw`
        w-full
        h-full 
      `}
    }
  }

  .empty-container {
    ${tw`
      flex
      flex-col
      font-semibold
    `}
  }
`

const GroupContainer = styled.div`
  ${tw`
    flex
    flex-col
    mb-8
    w-full
    opacity-0
  `}
  animation: ${(props) =>
    `fadeInFromBottom 0.5s ease-in-out forwards ${props.index / 7 + 0.5}s`};

  .group-title {
    ${tw`
      mb-3
      font-semibold
    `}
  }

  .card-container {
    ${tw`
      flex
      flex-col
      w-full     
    `}

    .list-card {
      ${tw`
        flex
        items-center
        justify-between
        mb-3
        p-3
        bg-white
        rounded-lg
      `}
      box-shadow: 1px 2px 23px 3px rgba(0,0,0,0.10);

      .left-box {
        ${tw`
          flex-grow
          flex
          flex-col
          xl:flex-row
          xl:items-center
          justify-between
        `}

        .left-title {
          ${tw`
            xl:mb-2
            md:text-lg
            font-semibold
          `}
        }

        .date-box {
          ${tw`
            mt-1
            md:mt-0
            flex
            items-center
            justify-start
            text-gray-500
            font-semibold
          `}

          .icon {
            ${tw`
              mr-2
              text-sm
              md:text-base
            `}
          }

          p {
            ${tw`
              text-xs
              sm:text-sm
              md:text-base
            `}
          }
        }
      }

      .right-box {
        ${tw`
          flex
          items-center
          justify-start
        `}

        .status-box {
          ${tw`
            py-1
            px-2
            mx-1
            sm:mx-3
            md:mx-6
            text-xs
            sm:text-sm
            md:text-base
            border
            md:border-2
            font-semibold
            rounded-lg
          `}
        }

        .cancel-box {
          ${tw`
            text-red-500
            border-red-500
          `}
        }

        .complete-box {
          ${tw`
            text-blue-400
            border-blue-400
          `}
        }

        .notcom-box {
          ${tw`
            text-yellow-500
            border-yellow-500
          `}
        }

        .view-box {
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
              text-yellow-500
              pointer-events-none
            `}
          }

          &:hover {
            ${tw`
              bg-gray-200
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

export default HistoryPage
