import { FETCH_STORIES } from '../shared/constants/actionTypes';

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_STORIES: {
      return action.payload;
    }
  }
  return state;
}
