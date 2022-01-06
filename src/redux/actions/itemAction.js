import {
  ITEM_INFO_REQUEST,
  ITEM_INFO_SUCCESS,
  ITEM_INFO_FAIL,
  ITEM_INFO_CLOSE,
  ITEM_DELETE,
} from '../constants/itemConstant'
import {
  NEW_ITEM_CREATED,
  CATEGORY_REMOVE_ITEM,
} from '../constants/categoryConstant'

export const getItemInfoNOpen = (data, cateId, category) => (dispatch) => {
  dispatch({ type: ITEM_INFO_REQUEST })

  try {
    if (data.errors) {
      dispatch({ type: ITEM_INFO_FAIL, payload: 'Item Not Found' })
      return
    }

    dispatch({
      type: ITEM_INFO_SUCCESS,
      payload: { cateId, ...data.getItemInfo, category },
    })
  } catch (err) {
    dispatch({ type: ITEM_INFO_FAIL, payload: err })
  }
}

export const closeItemInfoForm = () => (dispatch) => {
  dispatch({ type: ITEM_INFO_CLOSE })
}

export const newItemCreated = (data) => (dispatch) => {
  dispatch({ type: NEW_ITEM_CREATED, payload: { ...data } })
}

export const deleteItemFromCategory = (itemId) => (dispatch) => {
  dispatch({ type: ITEM_DELETE, payload: itemId })
  dispatch({ type: CATEGORY_REMOVE_ITEM, payload: itemId })
}
