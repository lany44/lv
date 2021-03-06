/*
 * @Author: yanglan 
 * @Date: 2018-06-19 15:58:35 
 * @Last Modified by:   yanglan 
 * @Last Modified time: 2018-06-19 15:58:35 
 */

import {VNode} from './vnode'

export const isArray = (value): boolean => Array.isArray(value)

export const isString = (value): boolean => typeof value === 'string'

export const isVnode = (vnode: any): vnode is VNode => vnode.tag !== undefined