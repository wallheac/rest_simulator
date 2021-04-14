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

//this will determine how many times the script hits the /sensor endpoint
const NUMBER_OF_DATA_TO_SEND = 100
//this will determine the interval between http requests
const SLEEP_INTERVAL = 2000

const man = "NIWC"
const model = "NGB Mounted RN Sensor"
const serialNumber = "VMRDS"

const statuses = ["STATUS_GREEN", "STATUS_YELLOW", "STATUS_RED"]
const messages = ['', 'mildly out of sorts', 'AAAAACKK!']

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
    "rr_serialNumber" : "567",
    "isotopes": "2",
    "isotopes_0_name": "Isotope One",
    "isotopes_1_name": "Isotope Two",
    "isotopes_0_confIndication": "67",
    "isotopes_1_confIndication": "92",
}

const id = `manufacturer=${man}&model=${model}&serialNumber=${serialNumber}&`

async function go() {
    let counter = 0
    while(counter < NUMBER_OF_DATA_TO_SEND) {
        const num = counter % statuses.length
        const queryParams = Object.entries(pairs)
            .reduce((curr, [key, value]) => {
                //if value is a string, add string to query params
                if(typeof value === 'string') {
                    return curr.concat(`&${key}=${value}`)
                }
                //if the value is an array, add a (rotating) value
                return curr.concat(`&${key}=${value[num]}`)
            }, "")

        await sleep(SLEEP_INTERVAL)

        const url = `http://localhost:8080/sensor?${id}${queryParams}`
        //for debugging purposes - this logs the URL out to the console
        console.log(url)
        axios.get(url)
        
        counter ++
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

go()