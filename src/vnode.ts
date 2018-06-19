/*
 * @Author: yanglan 
 * @Date: 2018-06-15 14:25:05 
 * @Last Modified by: yanglan
 * @Last Modified time: 2018-06-19 16:24:25
 */

export interface VNode {
    tagName: string
    text: string | undefined
    props: VNodeData | undefined
    children: Array<any | string> | undefined
    el: Element | undefined
}

export interface VNodeData {
    tagName?: string | undefined
    class?: string | undefined
    id?: string | undefined
    style?: Object | undefined
    on?: Object | undefined
}

export const vnode = (
    tagName, 
    text: string | undefined,
    props: any | undefined,
    children: Array<VNode> | undefined
) : VNode => {
    return {
        tagName,
        text,
        props,
        children,
        el: undefined
    }
}