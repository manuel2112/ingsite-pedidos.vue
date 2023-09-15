import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    { 
        path: '/',
        name: 'login',
        component: () => import(/* webpackChunkName: "LoginPage" */ '@/modules/login/pages/LoginPage'),
    },
    { 
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "HomePage" */ '@/modules/home/pages/HomePage')
    },
    { 
        path: '/ultimos-pedido',
        name: 'ultimos',
        component: () => import(/* webpackChunkName: "UltimosPage" */ '@/modules/ultimos/pages/UltimosPage')
    },
    { 
        path: '/pedido',
        name: 'pedido',
        component: () => import(/* webpackChunkName: "PedidoPage" */ '@/modules/pedido/pages/PedidoPage')
    },
    // { 
    //     path: '/:pathMatch(.*)*', 
    //     component: () => import(/* webpackChunkName: "NoPageFound" */ '@/modules/shared/pages/NoPageFound') 
    // },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})  

export default router