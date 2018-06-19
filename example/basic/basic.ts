/*
 * @Author: yanglan 
 * @Date: 2018-06-15 16:25:41 
 * @Last Modified by: yanglan
 * @Last Modified time: 2018-06-19 16:36:04
 */

import lv from '../../src/lv';
import h from '../../src/h';

const app = document.getElementById('app')

const data = h('ul', [
    h('li', {}, '冬瓜皮'),
    h('li', {}, '西瓜皮'),
    h('li', {}, '麻辣烫'),
    h(
        'li', 
        {
            style: {color: 'red'}
        }, 
        '水煮鱼'
    )
])

app.appendChild(lv(data))
