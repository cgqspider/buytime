import express from 'express';
import { APP_PORT, DB_URL, DB_HOST, DB_NAME, DB_USER, DB_PASS } from './config';
import errorHandler from './middlewares/errorHandler';
const app = express();
import routes from './routes';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import mysql from 'mysql';
import socket from 'socket.io';
import swaggerUI, { serve } from 'swagger-ui-express';
import YAML from 'yamljs';

//setup of swagger 
const swaggerJSDocs = YAML.load("../documentation/api.yaml");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Database connection
var con = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// mongoose.connect(DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
// });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('DB connected...');
});

global.appRoot = path.resolve(__dirname);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(function (req, res, next) {
  req.con = con
  next()
})




app.use('/api', routes);
app.use('/uploads', express.static('uploads'));


app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

// app.use('/', (req, res) => {
//     res.send(`
//   <h1>Welcome to E-commerce Rest APIs</h1>
//   This Project is Developed by Team Wakeupcoders
//   `);
// });

app.use(errorHandler);
const PORT = process.env.PORT || APP_PORT;
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));

const io = socket(server);

app.io=io;

io.on("connection", (socket) => {
  console.log("Connect client" + socket);
});

