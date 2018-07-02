/*
 * @Author: yanglan 
 * @Date: 2018-06-19 14:40:40 
 * @Last Modified by: yanglan
 * @Last Modified time: 2018-06-19 15:37:25
 */

export interface DOMAPI {
    createElement: (tag: any) => HTMLElement;
    appendChild: (node: Node, child: Node) => void;
    tagName: (el: Element) => string;
    parentNode: (node: Node) => Node;
    insertBefore: (parentNode: Node, newNode: Node, referenceNode: Node | null) => void;
    nextSibling: (node: Node) => Node;
    setTextContent: (node: Node, text: string | null) => void;
    removeChild: (node: Node, child: Node) => void;
}

function createElement(tag: any): HTMLElement {
    return document.createElement(tag);
}

function appendChild(node: Node, child: Node): void {
    node.appendChild(child);
}

function tagName(el: Element): string {
    return el.tagName;
}

function parentNode(node: Node): Node | null {
    return node.parentNode;
}

function insertBefore(parentNode: Node, newNode: Node, referenceNode: Node | null): void {
    parentNode.insertBefore(newNode, referenceNode);
}

function nextSibling(node: Node): Node | null {
    return node.nextSibling;
}

function setTextContent(node: Node, text: string | null): void {
    node.textContent = text;
}

function removeChild(node: Node, child: Node): void {
    node.removeChild(child);
}

export default {
    tagName,
    createElement,
    appendChild,
    parentNode,
    insertBefore,
    nextSibling,
    removeChild
} as DOMAPI