/*
 * @Author: yanglan 
 * @Date: 2018-06-15 16:25:41 
 * @Last Modified by: yanglan
 * @Last Modified time: 2018-06-25 23:14:38
 */

import {initPatch, h} from '../../src/lv'
import StyleModule from '../../src/modules/style'

const patch = initPatch([
    StyleModule
]);

let showDetail = false
let nodeTree

let list = h('ul', [
    h('li', {}, '冬瓜皮'),
    h('li', {}, '西瓜皮'),
    h('li', {}, '麻辣烫'),
    h('li', {style: {color: 'red'}}, '水煮鱼')
])

let detail = h('div', [
    h('h2', {}, '遥控车'),
    h('p', {}, '遥控车就是遥控车')
])

const render = () => {
    nodeTree = patch(nodeTree, view())
}

const view = () => showDetail ? detail : list

nodeTree = patch(document.getElementById('app'), view())

document.getElementById('change')
        .addEventListener('click', () => {
            showDetail = !showDetail
            render()
            console.log('nodeTree: ', nodeTree)
        })