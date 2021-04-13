var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var readline = require('readline');
var axios = require('axios');

var api = express();

api.use(cors());
api.use(logger('dev'));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

const make = "VMRDS"
const man = "man"
const model = "NGB mounted RN"
const pairs = {
    "neutron_health_status" : "STATUS_YELLOW",
    "neutron_health_message": "yellow message",
    "rr_health_status" : "STATUS_RED",
    "rr_health_message": "red message",
}

let id = `make=${make}&man=${man}&model=${model}&`
let queryParams =
Object.entries(pairs).reduce((curr, [key, value]) => 
    curr.concat(`&${key}=${value}`)
, "")
console.log(queryParams)
let url = `http://localhost:8080/sensors?${id}${queryParams}`;
axios.get(url);