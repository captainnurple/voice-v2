// exports.handler = (event, context) => {
exports.handler = () => {
  console.log("hello, World!");
  return {
    statusCode: 200,
    body: "hello, World!",
  };
};
