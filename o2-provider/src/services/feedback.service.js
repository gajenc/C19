const httpStatus = require('http-status');
const { callHasura } = require('./util/hasura');
const ApiError = require('../utils/ApiError');

const persistFeedback = async (feedback) => {
  const query = `
        mutation insert_o2_provider_feedback($object: o2_provider_feedback_insert_input!) {
            insert_o2_provider_feedback_one(object: $object){
            uuid
            }
        }
    `;
  const variable = {
    object: feedback,
  };
  const response = await callHasura(query, variable, 'insert_o2_provider_feedback');
  if (response.errors !== undefined)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to register feedback');
  feedback.uuid = response.data.insert_o2_provider_feedback_one.uuid;
  return feedback;
};

/**
 * Register a feedback
 * @param {Object} feedbackBody
 * @returns {Promise<User>}
 */
const registerFeedback = async (feedbackBody) => {
  const { feedback } = feedbackBody.message;
  let feedbackDbObject = {
    usable: feedback.usable,
    requirement_id: feedback.search_id,
    reason: feedback.reason,
    rating: feedback.rating.toString(),
    additional: feedback.additional,
  };

  feedbackDbObject = await persistFeedback(feedbackDbObject);

  return {
    uuid: feedbackDbObject.uuid,
  };
};

module.exports = {
  registerFeedback,
};
