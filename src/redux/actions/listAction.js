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

export const addItemToList = (item) => (dispatch) => {
  dispatch({ type: LIST_ADD_ITEM, payload: item })
}

export const removeItemFromList = (itemId) => (dispatch) => {
  dispatch({ type: LIST_REMOVE_ITEM, payload: itemId })
}

export const toggleItemQty = (itemId, value) => (dispatch) => {
  if (value <= 0) {
    dispatch({ type: LIST_REMOVE_ITEM, payload: itemId })
  } else {
    dispatch({ type: LIST_TOGGLE_ITEM_QTY, payload: { itemId, value } })
  }
}

export const toggleItemCheck = (itemId) => (dispatch) => {
  dispatch({ type: LIST_ITEM_CHECK_TOGGLE, payload: itemId })
}

export const toggleMobileListShow = () => (dispatch) => {
  dispatch({ type: LIST_MOBILE_TOGGLE })
}

export const setCreateList = (data) => (dispatch) => {
  dispatch({ type: LIST_ACTIVE, payload: { ...data, isEdit: false } })
}

export const setTitleEdit = (title) => (dispatch) => {
  dispatch({ type: LIST_TITLE_EDIT, payload: title })
}

export const setResetEdit = () => (dispatch) => {
  dispatch({ type: LIST_RESET_EDIT })
}

export const setClearActiveList = () => (dispatch) => {
  dispatch({ type: LIST_CANCEL_TOGGLE })
}
