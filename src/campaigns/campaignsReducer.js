import { FETCH_CAMPAIGNS } from '../shared/constants/actionTypes';

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_CAMPAIGNS: {
      return action.payload;
    }
  }
  return state;
}
