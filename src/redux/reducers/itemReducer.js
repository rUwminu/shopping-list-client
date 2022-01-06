import {
  ITEM_INFO_REQUEST,
  ITEM_INFO_SUCCESS,
  ITEM_INFO_FAIL,
  ITEM_INFO_CLOSE,
  ITEM_DELETE,
} from '../constants/itemConstant'
import { USER_SIGNOUT } from '../constants/userConstant'

export const itemInfoReducer = (
  state = { loading: true, isOpen: false },
  action
) => {
  switch (action.type) {
    case ITEM_INFO_REQUEST:
      return { loading: true }
    case ITEM_INFO_SUCCESS:
      return { loading: false, isOpen: true, item: action.payload }
    case ITEM_INFO_FAIL:
      return { loading: false, isOpen: true, itemError: action.payload }
    case ITEM_INFO_CLOSE:
      return { ...state, isOpen: false }
    case ITEM_DELETE:
      return { ...state, item: {}, isOpen: false }
    case USER_SIGNOUT:
      return { loading: true, isOpen: false }
    default:
      return state
  }
}
