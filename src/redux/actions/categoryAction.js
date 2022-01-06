import {
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
} from '../constants/categoryConstant'

export const getCategoryList = (data) => (dispatch) => {
  dispatch({ type: CATEGORY_LIST_REQUEST })

  try {
    if (data.error) {
      dispatch({ type: CATEGORY_LIST_FAIL, payload: data.error })
    }

    dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data.getSelfCategory })
  } catch (err) {
    dispatch({ type: CATEGORY_LIST_FAIL, payload: err })
  }
}
