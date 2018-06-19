/*
 * @Author: yanglan 
 * @Date: 2018-06-19 14:07:46 
 * @Last Modified by: yanglan
 * @Last Modified time: 2018-06-19 16:26:40
 */

import { vnode, VNode, VNodeData } from "./vnode"
import {isArray, isString} from './modules/is'

console.log('vnode: ', vnode)

export function h(tagName: string): VNode
export function h(tagName: string, props: VNodeData): VNode 
export function h(tagName: string, children: Array<VNode>): VNode 
export function h(tagName: string, props: VNodeData, children: Array<VNode>): VNode 
export function h(tagName: string, props: VNodeData, text: string): VNode 
export function h(tagName: string, b?: any, c?: any): VNode {
    let text, props, children
    if (c) {
        if (isString(c)) {props = b; text = c}
        if (isArray(c)) {props = b; children = c}
    } 
    else if (b) {
        if (isArray(b)) {
            children = b
        } else {
            props = b
        }
    }

    return vnode(tagName, text, props, children)
}

export default h