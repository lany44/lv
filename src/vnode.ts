/*
 * @Author: yanglan 
 * @Date: 2018-06-15 14:25:05 
 * @Last Modified by: yanglan
 * @Last Modified time: 2018-06-19 16:24:25
 */

import {Hooks} from './hooks';

export type Key = string | number;

export interface VNode {
    tag: string
    text: string | undefined
    props: VNodeData | undefined
    children: Array<any | string> | undefined
    el: Node | undefined,
    key: Key | undefined
}

export interface VNodeData {
    key?: string | number
    tag?: string | undefined
    class?: string | undefined
    id?: string | undefined
    style?: Object | undefined
    on?: Object | undefined
    hook?: Hooks;
}

export const vnode = (
    tag,
    text: string | undefined,
    props: any | undefined,
    children: Array<VNode> | undefined,
    el: Element | Text | undefined
) : VNode => {
    return {
        tag,
        text,
        props,
        children,
        el,
        key: props ? props.key : undefined
    }
}