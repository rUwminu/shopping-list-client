import {
  LIST_ADD_ITEM,
  LIST_REMOVE_ITEM,
  LIST_TOGGLE_ITEM_QTY,
  LIST_ACTIVE,
  LIST_TITLE_EDIT,
  LIST_RESET_EDIT,
  LIST_MOBILE_TOGGLE,
  LIST_CANCEL_TOGGLE,
  LIST_ITEM_CHECK_TOGGLE,
} from '../constants/listConstant'
import { USER_SIGNOUT } from '../constants/userConstant'

export const listItemReducer = (
  state = {
    activeList: { title: '', items: [], isEdit: false },
    isListOpen: false,
  },
  action
) => {
  var newArr = []

  switch (action.type) {
    case LIST_ADD_ITEM:
      const itemExist = state.activeList.items.find(
        (x) => x.itemId === action.payload.itemId
      )

      if (itemExist) {
        const newArr = state.activeList.items.map((item) => {
          var temp = Object.assign({}, item)

          if (temp.itemId === action.payload.itemId) {
            temp.qty = temp.qty + 1
          }

          return temp
        })

        return {
          activeList: { ...state.activeList, items: [...newArr] },
        }
      }

      return {
        activeList: {
          ...state.activeList,
          items: [...state.activeList.items, { ...action.payload, qty: 1 }],
          isEdit: true,
        },
      }
    case LIST_REMOVE_ITEM:
      return {
        ...state,
        activeList: {
          ...state.activeList,
          items: state.activeList.items.filter(
            (x) => x.itemId !== action.payload
          ),
          isEdit: true,
        },
      }
    case LIST_TOGGLE_ITEM_QTY:
      newArr = state.activeList.items.map((item) => {
        var temp = Object.assign({}, item)

        if (temp.itemId === action.payload.itemId) {
          temp.qty = action.payload.value
        }

        return temp
      })

      return {
        ...state,
        activeList: { ...state.activeList, items: [...newArr], isEdit: true },
      }
    case LIST_ITEM_CHECK_TOGGLE:
      newArr = state.activeList.items.map((item) => {
        var temp = Object.assign({}, item)

        if (temp.itemId === action.payload) {
          temp.isComplete = !temp.isComplete
        }

        return temp
      })

      return {
        ...state,
        activeList: { ...state.activeList, items: [...newArr] },
      }
    case LIST_ACTIVE:
      return { activeList: { ...action.payload, isEdit: false } }
    case LIST_TITLE_EDIT:
      return { activeList: { ...state.activeList, title: action.payload } }
    case LIST_RESET_EDIT:
      return { activeList: { ...state.activeList, isEdit: false } }
    case LIST_MOBILE_TOGGLE:
      return { ...state, isListOpen: !state.isListOpen }
    case LIST_CANCEL_TOGGLE: {
      return { ...state, activeList: { title: '', items: [], isEdit: false } }
    }
    case USER_SIGNOUT:
      return {
        activeList: { title: '', items: [], isEdit: false },
        isListOpen: false,
      }
    default:
      return state
  }
}
