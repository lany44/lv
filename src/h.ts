/*
 * @Author: yanglan 
 * @Date: 2018-06-19 14:07:46 
 * @Last Modified by: yanglan
 * @Last Modified time: 2018-06-19 16:26:40
 */

import { vnode, VNode, VNodeData } from "./vnode"
import {isArray, isString} from './is'

export function h(tag: string): VNode
export function h(tag: string, props: VNodeData): VNode
export function h(tag: string, children: Array<VNode>): VNode
export function h(tag: string, props: VNodeData, children: Array<VNode>): VNode
export function h(tag: string, props: VNodeData, text: string): VNode
export function h(tag: string, b?: any, c?: any): VNode {
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

    return vnode(tag, text, props, children, undefined)
}

export default h