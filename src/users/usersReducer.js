import { FETCH_USERS } from '../shared/constants/actionTypes';

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_USERS: {
      return action.payload;
    }
  }
  return state;
}
