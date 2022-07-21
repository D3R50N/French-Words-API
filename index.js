const { url } = require('./config');

const axios = require('axios').default;
const { log, clear } = require('console');
const parser = require('node-html-parser');



var counter = 1;
var interval = setInterval(() => {
    clear();
    log('Getting from source', '.'.repeat((counter++) % 5));
}, 200);



/*******NOTE Class */
class Section {
    constructor() {

    }
}





/*******NOTE Function */
axios
    .get(url)
    .then((response) => {
        clearInterval(interval);
        treatData(response.data);
    })
    .catch((error) => {
        log('There is an error : ', error);
    })
    .then(() => {
        log('Finished in ', counter / 5, 's !');
    });


function treatData(dom_data) {
    let document = parser.parse(dom_data);

    let headLines = document.querySelectorAll('.mw-headline');
    let container = document.querySelector('#mw-content-text').firstChild;



    let sections = container.childNodes;
    for (let index = 0; index < sections.length; index++) {
        const element = sections[index];
        log(element.structure)
    }

    // let categories = sections.at(1).getElementsByTagName('b');
    // log(getAllTextContent(categories));
}

function getAllTextContent(elements = []) {
    let array = [];
    elements.forEach((element) => {
        array.push(getTextContent(element));
    });
    return array;
}
function getTextContent(element = new parser.HTMLElement) {
    return element.text;
}