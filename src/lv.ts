/*
 * @Author: yanglan 
 * @Date: 2018-06-19 14:58:25 
 * @Last Modified by: yanglan
 * @Last Modified time: 2018-06-19 16:36:58
 */

 import API from './modules/dom-api'
 import {VNode} from './vnode'

const lv = (vnode: VNode) => {
    const props = vnode.props;

    let el: HTMLElement = API.createElement(vnode.tagName as string)

    if (vnode.text) {
        el.innerText = vnode.text
    }

    if (props) {
        if (props.class) {
            el.setAttribute('class', props.class)
        }
    
        if (props.id) {
            el.setAttribute('id', props.class)
        }
    
        if (props.style) {
            el.style.cssText = Object.keys(props.style).reduce((acc, cur) => `${acc} ${cur}:${props.style[cur]};`, '')
        }
    }

    if (vnode.children) {
        vnode.children.forEach(childNode => API.appendChild(el, lv(childNode)))
    }

    return vnode.el = el;
 };

 export default lv