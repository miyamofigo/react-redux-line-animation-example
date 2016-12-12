import { SET_OFFSET } from '../actions'

const intitialState = {
  offset: 0 
}

export const lineAnimationApp = (state = intitialState,
  action) => {
  switch (action.type) {
    case SET_OFFSET: 
      return Object.assign({}, state, {
        offset: action.offset
      })
    default:
      return state
  } 
}
