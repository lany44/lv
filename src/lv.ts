/*
 * @Author: yanglan 
 * @Date: 2018-06-19 14:58:25 
 * @Last Modified by: yanglan
 * @Last Modified time: 2018-06-25 23:06:45
 */

 import {Module} from './modules/module';
 
 import {default as DomAPI, DOMAPI} from './dom-api'
 import {isVnode} from './is'
 import {Hooks} from './hooks'
 import {VNode, VNodeData, vnode, Key} from './vnode'

 type VNodeQueue = Array<VNode>

 type KeyToIndexMap = {[key: string]: number}

 type ArraysOf<T> = {
    [K in keyof T]: (T[K])[];
 }
  
 type ModuleHooks = ArraysOf<Module>;

 const emptyNode = vnode('', '', {}, [], undefined);

 const isDef = (s: any): boolean => s !== undefined

 const isUnDef = (s: any): boolean => s === undefined

 const sameVnode = (vnode1: VNode, vnode2: VNode): boolean => vnode1.key === vnode2.key && vnode1.tag === vnode2.tag

 const hooks: (keyof Module)[] = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

 const createKeyToOldIdx = (children: Array<VNode>, beginIdx: number, endIdx: number): KeyToIndexMap  => {
    let i: number
    let map: KeyToIndexMap = {}
    let key: Key | undefined
    let ch

    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i]
        if (ch != null) {
            key = ch.key
            if (key !== undefined) map[key] = i
        }
    }
    return map
 }

 //-

 export {h} from './h'

 export const initPatch = (modules: Array<Partial<Module>>, api?: DOMAPI) => {
    let i: number, j: number
    let cbs = ({} as ModuleHooks)

    const API: DOMAPI = api !== undefined ? api : DomAPI;

    // prepare module hooks
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            const hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                (cbs[hooks[i]] as Array<any>).push(hook);
            }
        }
    }

    const emptyNodeAt = (el: Element) : VNode => vnode(API.tagName(el).toLowerCase(), undefined, {}, [], el)

    const invokeDestroyHook = (vnode: VNode) => {
        let i: any, j: number
        let props = vnode.props;

        if (props !== undefined) {
            // vnode.hook['destory']
            if (isDef(i = props.hook) && isDef(i = i.destroy)) i(vnode)

            // destory hook
            for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)

            if (vnode.children !== undefined) {
                for (j = 0; j < vnode.children.length; ++j) {
                    i = vnode.children[j];
                    invokeDestroyHook(i);
                }
            }
        }
    }

    function createRmCb(childEl: Node, listeners: number) {
        return function rmCb() {
            if (--listeners === 0) {
                const parent = api.parentNode(childEl);
                api.removeChild(parent, childEl);
            }
        }
    }

    const createElement = (vnode: VNode, insertedVnodeQueue: VNodeQueue) : Node => {
        let i;
        let props = vnode.props;

        // vnode.hook['init']
        if (isDef(props) && isDef(i = props.hook) && isDef(i = i.init)) i(vnode);
    
        let el: HTMLElement = API.createElement(vnode.tag as string)
    
        if (vnode.text) el.innerText = vnode.text

        // create hook
        for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);

        if (vnode.children) {
            vnode.children.forEach(childNode => API.appendChild(el, createElement(childNode, insertedVnodeQueue)))
        }

        i = vnode.props && (vnode.props as VNodeData).hook;
        if (isDef(i)) {
            if (i.create) i.create(emptyNode, vnode);
            if (i.insert) insertedVnodeQueue.push(vnode);
        }
    
        return vnode.el = el;
     }
    
     const addVnodes = (parentEl: Node, before: Node, vnodes: Array<VNode>, startIdx: number, endIdx: number, insertedVnodeQueue: VNodeQueue) => {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (ch != null) {
                API.insertBefore(parentEl, createElement(ch, insertedVnodeQueue), before);
            }
        }
     }
    
     const removeVnodes = (parentEl: Node, vnodes: Array<VNode>, startIdx: number, endIdx: number) => {
        for (; startIdx <= endIdx; ++startIdx) {
            let i: any
            let listeners: number
            let rm: () => void
            let ch = vnodes[startIdx]

            if (ch != null) {
                if (isDef(ch.text)) {
                    invokeDestroyHook(ch);

                    listeners = cbs.remove.length + 1;
    
                    rm = createRmCb(ch.el as Node, listeners);
    
                    for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
    
                    if (isDef(i = ch.props) && isDef(i = i.hook) && isDef(i = i.remove)) {
                        i(ch, rm);
                    } else {
                        rm();
                    }
                } else {
                    API.removeChild(parentEl, ch.el as Node);
                }
            }
        }
     }
    
     const updateChildren = (parentEl: Node, oldCh: Array<VNode>, newCh: Array<VNode>, insertedVnodeQueue: VNodeQueue) => {
        let oldStartIdx = 0,                 newStartIdx = 0
        let oldEndIdx = oldCh.length - 1,    newEndIdx = newCh.length - 1
        let oldStartVnode = oldCh[0],        newStartVnode = newCh[0]
        let oldEndVnode = oldCh[oldEndIdx],  newEndVnode = newCh[newEndIdx]
        let oldKeyToIdx: any
        let idxInOld: number
        let elToMove: VNode
        let before: any
    
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]
            } else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx]
            } else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx]
            } else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx]
            } else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
                oldStartVnode = oldCh[++oldStartIdx]
                newStartVnode = newCh[++newStartIdx]
            } else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
                oldEndVnode = oldCh[--oldEndIdx]
                newEndVnode = newCh[--newEndIdx]
            } else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
                API.insertBefore(parentEl, oldStartVnode.el as Node, API.nextSibling(oldStartVnode.el as Node))
                oldStartVnode = oldCh[++oldStartIdx]
                newEndVnode = newCh[--newEndIdx]
            } else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
                API.insertBefore(parentEl, oldEndVnode.el as Node, API.nextSibling(oldEndVnode.el as Node))
                oldEndVnode = oldCh[--oldEndIdx]
                newStartVnode = newCh[++newStartIdx]
            } else {
                if (isUnDef(oldKeyToIdx)) createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
    
                idxInOld = oldKeyToIdx[newStartVnode.key as string]
                if (isUnDef(idxInOld)) {
                    API.insertBefore(parentEl, createElement(newStartVnode, insertedVnodeQueue), oldStartVnode.el as Node)
                    newStartVnode = newCh[++newStartIdx]
                } else {
                    elToMove = oldCh[idxInOld]
                    if (elToMove.tag !== newStartVnode.tag) {
                        API.insertBefore(parentEl, createElement(newStartVnode, insertedVnodeQueue), oldStartVnode.el as Node)
                    } else {
                        patchVnode(elToMove, newStartVnode, insertedVnodeQueue)
                        oldCh[idxInOld] = undefined as any
                        API.insertBefore(parentEl, (elToMove.el as Node), oldStartVnode.el as Node)
                    }
    
                    newStartVnode = newCh[++newStartIdx]
                }
            }
        }
    
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            if (oldStartIdx > oldEndIdx) {
                before = newCh[newEndIdx + 1] == null ? null :  newCh[newEndIdx + 1].el
                addVnodes(parentEl, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
            } else {
                removeVnodes(parentEl, oldCh, oldStartIdx, oldEndIdx)
            }
        }
     }
    
     const patchVnode = (oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) => {
        // prepatch hook
        let i: any, hook: any;
        if (isDef(i = vnode.props) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) i(oldVnode, vnode);
    
        const el = vnode.el = oldVnode.el
        let oldCh = oldVnode.children
        let ch = vnode.children
    
        if (oldVnode === vnode) return
    
        if (isDef(vnode.props)) {
            // update props
            for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);

            // vnode.hook['update']
            i = vnode.props.hook;
            if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
        }
    
        if (isDef(vnode.text)) {
            API.setTextContent(el, vnode.text as string)
        } else {
            if (isDef(oldCh) && isDef(ch)) {
                // update children
                if (oldCh !== ch) updateChildren(el, oldCh as Array<VNode>, ch as Array<VNode>, insertedVnodeQueue)
            } else if (isDef(ch)) {
                // addVnodes
                if (isDef(oldVnode.text)) API.setTextContent(el, '');
                addVnodes(el, null, ch as Array<VNode>, 0, (ch as Array<VNode>).length - 1, insertedVnodeQueue);
            } else if (isDef(oldCh)) {
                // removeVnode
                removeVnodes(el, oldCh as Array<VNode>, 0, (oldCh as Array<VNode>).length - 1);
            } else if (isDef(oldVnode.text)) {
                API.setTextContent(el, '')
            }
        }
    
        // postpatch hook
        if (isDef(hook) && isDef(i = hook.postpatch)) i(oldVnode, vnode);
     }
    
     return (oldVnode: VNode | Element, vnode: VNode) : VNode => {
        let i: number;
        let el: Node;
        let parent: Node;
        const insertedVnodeQueue: VNodeQueue = [];
    
        // pre hook
        for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
    
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
    
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue)
        } else {
            el = oldVnode.el as Node
            parent = API.parentNode(el)
    
            createElement(vnode, insertedVnodeQueue);
    
            if (parent) {
                API.insertBefore(parent, vnode.el as Node, API.nextSibling(el))
                removeVnodes(parent, [oldVnode], 0, 0)
            }
        }
    
        // vnode.hook['insert']
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            (((insertedVnodeQueue[i].props as VNodeData).hook as Hooks).insert as any)(insertedVnodeQueue[i]);
        }

        // post hook
        for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    
        return vnode
     }
 }
