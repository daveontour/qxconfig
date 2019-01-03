import { Globals, XMLAttribute, XMLElement } from './globals';


export class TokenInterpretter {

    editor: any;
    root = new XMLElement('root');

    constructor(global: Globals) {

        const ace = global.editor.getEditor();
        const sess = ace.session;
        const len = sess.getLength();
        const elementStack = [];
        const attributeStack = [];


        let att: XMLAttribute;
        elementStack.push(this.root);

        let tokens = [];

        for (let i = 0; i < len; i++) {
            tokens = tokens.concat(sess.getTokens(i));
        }

        for (let j = 0; j < tokens.length; j++) {

            const tType = tokens[j].type;
            let tValue = tokens[j].value;

            if (tType === 'text.xml') {
               tValue  = tValue.trim();
               if (tValue.length < 1) {
                   continue;
               } else {
                   elementStack[elementStack.length - 1].setValue(tValue);
               }
               continue;
            }
            // Begining tag of an element
            if (tType === 'meta.tag.tag-name.xml' && tokens[ j - 1 ].type === 'meta.tag.punctuation.tag-open.xml') {
                const t = new XMLElement(tValue);
                elementStack[elementStack.length - 1].children.push(t);
                elementStack.push(t);
                continue;
            }

            // Closing tag of an element
            if (tType === 'meta.tag.punctuation.end-tag-open.xml') {
                elementStack.pop();
                continue;
            }
            // Closing tag of an element
            if (tValue === '/>') {
                elementStack.pop();
                continue;
            }
            // Attribute name
            if (tType === 'entity.other.attribute-name.xml') {
                att = new XMLAttribute(tValue);
                continue;
            }

            if (tType === 'string.attribute-value.xml') {
                tValue = tValue.substring(1, tValue.length - 1);
                att.setValue(tValue);
                elementStack[elementStack.length - 1].attributes.push(att);
                continue;
            }
        }
    }

    getRoot() {
        return this.root.children[0];
    }
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
