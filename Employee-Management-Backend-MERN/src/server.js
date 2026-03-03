const dotenv = require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT  || 5000;

(async ()=>{
    await connectDB();
    app.listen(PORT, ()=> console.log(`Server Is Running On Port: http://127.0.0.1:${PORT}`));
})();

    
