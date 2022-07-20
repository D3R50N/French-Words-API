const { url } = require('./config');

const axios = require('axios').default;
const { log, clear } = require('console');


var counter = 1;
const interval = setInterval(() => {
    clear();
    log('Getting from source', '.'.repeat((counter++) % 5));
}, 200);

axios
    .get(url)
    .then((response) => {
        clearInterval(interval);
        log(response.data);
    })
    .catch((error) => {
        log('There is an error : ', error);
    })
    .then(() => {
        log('Finished in ', counter / 5, 's !');
    });

