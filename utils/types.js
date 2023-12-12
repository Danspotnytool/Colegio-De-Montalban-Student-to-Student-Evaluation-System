
// This is a JSDoc types file. It's used to document JavaScript code.
// It's not required, but it's a good practice to use it.

/**
 * @typedef {{
 *      code: Number,
 *      payload: {} | {}[],
 *      status: String,
 * }} Response
 */

/**
 * @typedef {{
 *      firstName: String,
 *      middleName: String,
 *      lastName: String,
 *      studentNumber: String,
 *      gender: "male" | "female",
 *      birthday: String,
 *      profilePicture: String,
 *      email: String,
 *      course: String,
 *      section: String,
 *      year: String,
 *      password: String,
 *      token: String,
 *      timeAdded: String
 * }} Student
 */



/**
 * @typedef {{
 *      additionalStatement: String,
 *      contents: {
 *          category: String,
 *          name: String,
 *          value: String
 *      }[],
 *      evaluationID: String,
 *      receiverStudentNumber: String,
 *      receiverName: String,
 *      senderStudentNumber: String,
 *      senderName: String,
 *      timeAdded: String
 * }} Evaluation
 */



/**
 * @typedef {{
 *      id: String,
 *      timeAdded: String,
 *      content: {
 *          time: String,
 *          type: 'visit' | 'redirect',
 *          payload:{
 *              path: String,
 *              ip:{
 *                  HTTP_X_FORWARDED_FOR: String,
 *                  HTTP_CLIENT_IP: String
 *              },
 *              userAgent: String
 *          }
 *      }
 * }} SystemLogs
 */



// This part is unrelated to the above types, but it's required as a workaround to export types.
module.exports = {};