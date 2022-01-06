import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { gql, useMutation } from '@apollo/client'

// Styling import
import tw from 'twin.macro'
import styled from 'styled-components'

// Redux Action
import {
  toggleItemQty,
  removeItemFromList,
  toggleItemCheck,
} from '../../../redux/actions/listAction'

// mui icons
import { DeleteOutline, Remove, Add } from '@mui/icons-material'

const ItemCard = ({ type }) => {
  const dispatch = useDispatch()
  const [isEdit, setIsEdit] = useState('')

  const userSignIn = useSelector((state) => state.userSignIn)
  const { user } = userSignIn

  const listItem = useSelector((state) => state.listItem)
  const { activeList } = listItem

  const [toggleCompletionItem] = useMutation(UPDATE_TOGGLE_ITEM_COMPLETION, {
    context: {
      headers: {
        Authorization: `Bearer${' '}${user.token}`,
      },
    },
    update(_, { data }) {
      console.log(`Updated ` + data.updateToggleCompletionItem.id)
    },
    onError(err) {
      console.log(err)
    },
  })

  const handleCheck = (e, itemId) => {
    //console.log(e.target.checked)
    toggleCompletionItem({
      variables: {
        listId: activeList.id,
        itemId,
        value: e.target.checked,
      },
    })
    dispatch(toggleItemCheck(itemId))
  }

  const handleIncrement = (itemId, value) => {
    dispatch(toggleItemQty(itemId, value + 1))
  }

  const handleDecrement = (itemId, value) => {
    dispatch(toggleItemQty(itemId, value - 1))
  }

  const filtedItem = activeList.items.filter((x) => x.cateType === type)

  return filtedItem.map((x) => (
    <ItemBox
      key={x.itemId}
      className="item-box"
      onMouseLeave={() => setIsEdit(false)}
    >
      <label className={`checkbox-container`}>
        <p className={`${x.isComplete && 'line-through'}`}>{x.title}</p>
        {'isComplete' in x && (
          <>
            <input
              type="checkbox"
              onChange={(e) => handleCheck(e, x.itemId)}
              defaultChecked={x.isComplete && 'checked'}
            />
            <span className="checkmark"></span>
          </>
        )}
      </label>
      <div
        className={`item-edit-box ${isEdit === x.itemId && 'active'} ${
          x.isComplete && 'pointer-events-none'
        }`}
      >
        <div
          className={`icon-box trash-box ${isEdit === x.itemId && 'active'}`}
          onClick={() => dispatch(removeItemFromList(x.itemId))}
        >
          <DeleteOutline className="icon" />
        </div>
        <div
          className={`icon-box op-box ${isEdit === x.itemId && 'active'}`}
          onClick={() => handleDecrement(x.itemId, x.qty)}
        >
          <Remove className="icon" />
        </div>
        <div className="item-qty" onClick={() => setIsEdit(x.itemId)}>
          {x.qty} pcs
        </div>
        <div
          className={`icon-box op-box ${isEdit === x.itemId && 'active'}`}
          onClick={() => handleIncrement(x.itemId, x.qty)}
        >
          <Add className="icon" />
        </div>
      </div>
    </ItemBox>
  ))
}

const UPDATE_TOGGLE_ITEM_COMPLETION = gql`
  mutation updateToggleCompletionItem(
    $listId: ID!
    $itemId: ID!
    $value: Boolean!
  ) {
    updateToggleCompletionItem(
      listId: $listId
      itemId: $itemId
      value: $value
    ) {
      id
    }
  }
`

const ItemBox = styled.div`
  ${tw`
    relative
    flex
    items-center
    justify-between
    h-12
    my-2

    transition-all
  `}
  animation: fadeInFromRight 0.5s ease-in-out forwards;

  .checkbox-container {
    ${tw`
      relative
      flex
      items-center
      justify-center
      pl-9
      cursor-pointer
    `}

    p {
      ${tw`
        text-sm
        md:text-base
      `}
    }

    input {
      ${tw`
        absolute
        opacity-0
        cursor-pointer

        transition
        duration-200
        ease-in-out
      `}
    }

    .checkmark {
      ${tw`
        absolute
        top-0
        left-0
        h-5
        w-5
        md:h-6
        md:w-6
        border-2
        border-gray-400
        rounded-md
      `}
    }

    input:checked ~ .checkmark {
      ${tw`
        border-yellow-500
      `}
    }

    .checkmark:after {
      content: '';
      ${tw`
        absolute
        left-0
        hidden
      `}
    }

    input:checked ~ .checkmark:after {
      ${tw`
        flex
      `}
    }

    .checkmark:after {
      ${tw`
        left-[5.5px]
        md:left-[7px]
        top-[2px]
        w-[6px]
        h-[11px]
        md:w-[8px]
        md:h-[13px]
        border-yellow-500
      `}
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
    }
  }

  .item-edit-box {
    ${tw`
        flex
        items-center
        justify-start
        rounded-xl

        transition-all
        duration-500
        ease-in-out
    `}

    .icon-box {
      ${tw`
        flex
        items-center
        justify-center
        w-0
        h-0
        rounded-xl
        cursor-pointer

        transition-all
        duration-200
        ease-in-out
      `}

      .icon {
        ${tw`
            w-full
            pointer-events-none
        `}
      }
    }

    .icon-box.active {
      ${tw`
        w-8
        md:w-10
        h-full
        px-1
        md:px-2
      `}
    }

    .trash-box {
      ${tw`
        bg-yellow-500
        text-gray-50
      `}

      &:hover {
        ${tw`
            bg-opacity-80
        `}
      }
    }

    .op-box {
      ${tw`
        text-yellow-500
      `}

      &:hover {
        ${tw`
            bg-gray-200
        `}
      }
    }
  }

  .item-edit-box.active {
    ${tw`
        absolute
        right-0
        w-auto
        h-full
        bg-white
    `}
  }

  span {
    ${tw`
        font-semibold
    `}
  }

  .item-qty {
    ${tw`
        flex
        items-center
        justify-center
        w-16
        md:w-20
        min-w-min
        max-h-10
        py-1
        text-sm
        md:text-base
        font-semibold
        text-yellow-500
        border-2
        border-yellow-500
        rounded-3xl
        cursor-pointer
    `}
  }

  @keyframes fadeInFromRight {
    from {
      opacity: 0;
      transform: translateX(50%);
    }
    to {
      opacity: 1;
      transform: translateX(0%);
    }
  }
`

export default ItemCard
