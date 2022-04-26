import { SubmissionError } from 'redux-form';

export const parseFormErrors = (error) => {
  if (error.response && error.response.data.errors) {
    throw new SubmissionError(error.response.data.errors);
  } else {
    const message = error.response && error.response.data.error || error.message;
    throw new SubmissionError({ _error: message });
  }
}
