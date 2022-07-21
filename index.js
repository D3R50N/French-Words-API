const { url } = require('./config');

const axios = require('axios').default;
const { log, clear } = require('console');
const { parse } = require('node-html-parser');
const fs = require('fs');



var counter = 1;
var interval = setInterval(() => {
    clear();
    log('Getting from source', '.'.repeat((counter++) % 5));
}, 200);



/*******NOTE Class */
class Section {
    constructor(title = '') {
        this.title = title;
        this.content = [];
        // all_sections.push(this);
    }
}
var all_sections = [new Section()];
all_sections = [];




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
    let document = parse(dom_data);

    let headLines = document.querySelectorAll('h3 > .mw-headline');

    headLines.forEach((hdl) => {
        all_sections.push(new Section(hdl.text));
    })
    let counter = 0;
    let container = document.querySelector('#mw-content-text').querySelectorAll('.mw-parser-output')[0];


    let sections = container.querySelectorAll(':scope > ');
    for (let index = 0; index < sections.length; index++) {
        const element = sections[index];
        if (element.tagName != 'P' || element.text.includes('Liste') || element.text.includes('portière') || element.text.includes('voyager'))
            continue;

        if (counter < all_sections.length)
            all_sections[counter].content.push(element.text);

        if (element.nextElementSibling == undefined || element.nextElementSibling.tagName != 'P') {
            if (counter < headLines.length)
                all_sections[counter].title = headLines[counter].text;
            counter++;
        }
    }
    fs.writeFile('log.json', '[\n' + all_sections.map((section, index) => {
        let content = "";
        section.content.forEach((c,key) => {
            if(c.includes(':'))
                content += `
            {
                "${c.split(' :')[0]}" : "${c.split(' :')[1].split('\n').join().trim()}"
            }${key < section.content.length-1 ?',':''}
            `;
        })
        return `
        {
            "title" : "${section.title}",
            "content" : [
                ${content}
            ]
        }

        `;
    }).toString()+'\n]', () => {
        log("Fini")
    })
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