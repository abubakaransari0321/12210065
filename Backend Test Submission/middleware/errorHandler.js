function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
}

module.exports = { errorHandler };


// .env
PORT=3000
MONGO_URI=mongodb; //localhost:27017/urlshortener 
