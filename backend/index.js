const express = require("express");
const conectToDatabase = require('./connect');
conectToDatabase();
const app = express();
const port = 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use("/user-control/api/signup" ,require('./Routes/Signup'));
app.use("/user-control/api/request/signup" ,require('./Routes/Request'));
app.use("/user-control/api/fetch" ,require('./Routes/FetchAll'));
app.use("/user-control/api/auth" ,require('./Routes/Login'));
app.use("/user-control/api/update" ,require('./Routes/Update'));
app.use("/user-control/api/delete" ,require('./Routes/Delete'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
