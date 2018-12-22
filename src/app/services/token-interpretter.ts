import { Globals } from './globals';
import { element } from '@angular/core/src/render3';

export class TokenInterpretter {

    editor: any;

    constructor(global: Globals) {

        const ace = global.editor.getEditor();
        const sess = ace.session;
        const len = sess.getLength();
        const elementStack = [];
        const attributeStack = [];

        let root: XMLElement;
        for (let i = 0; i < len; i++) {
         const tokens = sess.getTokens(i);
         console.log(tokens);
         for ( let j = 0; j < tokens.length; j++) {
             if (tokens[j].type === 'meta.tag.tag-name.xml') {
                 const t = new XMLElement(tokens[j].value);
                 if (elementStack.length === 0 ) {
                     elementStack.push(t);
                     root = t;
                 } else {
                     elementStack[elementStack.length - 1].children.push(t);
                 }
             }
             if (tokens[j].type === 'meta.tag.punctuation.end-tag-open.xml' || tokens[j].type === '/>') {
                 elementStack.pop();
             }
             console.log(root);
         }
        }
        console.log(root);
    }
}

class XMLElement {
    constructor(n: string) {
        this.name = n;
    }
    name: string;
    path: string;
    value: string;
    parent: XMLElement;
    children: XMLElement[] = [];
    attributes: XMLAttribute[] = [];
}

class XMLAttribute {
    name: string;
    value: string;
}

// var stack = [];
// stack.push(2);       // stack is now [2]
// stack.push(5);       // stack is now [2, 5]
// var i = stack.pop(); // stack is now [2]
// alert(i);            // displays 5

// var queue = [];
// queue.push(2);         // queue is now [2]
// queue.push(5);         // queue is now [2, 5]
// var i = queue.shift(); // queue is now [5]
// alert(i);              // displays 2
