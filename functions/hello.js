// exports.handler = (event, context) => {

// eslint-disable-next-line no-unused-vars
exports.handler = (event, context) => {
  console.log("hello, World!");
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" }),
  };
};
