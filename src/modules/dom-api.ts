/*
 * @Author: yanglan 
 * @Date: 2018-06-19 14:40:40 
 * @Last Modified by: yanglan
 * @Last Modified time: 2018-06-19 15:37:25
 */

export interface DOMAPI {
    createElement: (tagName: any) => HTMLElement;
    appendChild: (node: Node, child: Node) => void;
}

function createElement(tagName: any): HTMLElement {
    return document.createElement(tagName);
}

function appendChild(node: Node, child: Node): void {
    node.appendChild(child);
}

export default {
    createElement,
    appendChild
} as DOMAPI