import {
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  NEW_ITEM_CREATED,
  CATEGORY_REMOVE_ITEM,
} from '../constants/categoryConstant'
import { USER_SIGNOUT } from '../constants/userConstant'

export const categoryListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return { loading: true }
    case CATEGORY_LIST_SUCCESS:
      return { loading: false, allCategory: action.payload }
    case CATEGORY_LIST_FAIL:
      return { loading: false, cateError: action.payload }
    case NEW_ITEM_CREATED:
      const updatedObj = action.payload
      const checkArr = state.allCategory.some((x) => x.id === updatedObj.id)

      if (!checkArr) {
        const newArr = [updatedObj, ...state.allCategory]

        return {
          ...state,
          allCategory: newArr,
        }
      }

      return {
        ...state,
        allCategory: state.allCategory.map((obj) =>
          updatedObj.id === obj.id ? updatedObj : obj
        ),
      }
    case CATEGORY_REMOVE_ITEM:
      return {
        ...state,
        allCategory: state.allCategory.map((item) => {
          return {
            ...item,
            items: item.items.filter((x) => x.id !== action.payload),
          }
        }),
      }
    case USER_SIGNOUT:
      return { loading: true }
    default:
      return state
  }
}
