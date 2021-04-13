var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var axios = require('axios');

var api = express();

api.use(cors());
api.use(logger('dev'));
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

const serialNumber = "VMRDS"
const man = "NIWC"
const model = "NGB Mounted RN Sensor"

const statuses = ["STATUS_GREEN", "STATUS_YELLOW", "STATUS_RED"]
const messages = ['super green', 'mildly out of sorts', 'AAAAACKK!']

const pairs = {
    "neutron_health_status" : statuses,
    "neutron_health_message": messages,
    "fl_health_status" : statuses,
    "fl_health_message": messages,
    "fr_health_status" : statuses,
    "fr_health_message": messages,
    "rl_health_status" : statuses,
    "rl_health_message": messages,
    "rr_health_status" : statuses,
    "rr_health_message": messages,
    "boss_health_status" : statuses,
    "boss_health_message": messages,
    "neutron_serial_number": "123",
    "fl_serialNumber" : "234",
    "fr_serialNumber" : "345",
    "rl_serialNumber" : "456",
    "rr_serialNumber" : "567"
}

let id = `manufacturer=${man}&model=${model}&serialNumber=${serialNumber}&`

async function go() {
let counter = 0
while(counter < 100) {
        let num = counter % 3
        let queryParams = Object.entries(pairs)
            .reduce((curr, [key, value]) => {
                if(typeof value === 'string') {
                    return curr.concat(`&${key}=${value}`)
                }
                return curr.concat(`&${key}=${value[num]}`)
            }, "")

        await sleep(1000)
        console.log("in then " + counter)
            
            let url = `http://localhost:8080/sensor?${id}${queryParams}`;
            console.log(url)
            axios.get(url);
            counter ++
        
        }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

go()