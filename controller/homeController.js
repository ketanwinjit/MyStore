/**
 *! HOME CONTROLLER
 */
/**
 * ! EITHER HANDLE CONTROL USING PROMISE OR TRY CATCH
 * ! EXAMPLE MENTION BELOW
 */

const BigPromise = require("../middleware/bigPromise");

exports.home = BigPromise(async (req, res) => {
  // const something = await doSomething();
  res.status(200).json({
    success: true,
    greetings: "Hello from API",
  });
});

// exports.home = (req, res) => {
//   try {
//     // const something = await doSomething();
//   res.status(200).json({
//     success: true,
//     greetings: "Hello from API",
//   });
//   } catch (error) {
//     console.log(error)
//   }
// }
