import router from "@/router/router";

import {urlApi, setWithExpiry} from "@/modules/shared/helpers/helpers"
import Swal from 'sweetalert2';

export const loginPostApi = async ({ commit }, data) => {
    Swal.showLoading();

    const res = await fetch(urlApi('usuario'), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({login: data})
            });
    const content = await res.json();

    if( content.error ){
        Swal.fire({
            title: 'LOGIN',
            text: content.info,
            icon: 'error',
            confirmButtonColor: '#0275d8',
            allowOutsideClick: false
        });
    }else{
        const vendedor  = {};
        vendedor.usuario_id     = content.info.usuario.usuario_id;
        vendedor.usuario_nombre = content.info.usuario.usuario_nombre;
        setWithExpiry(vendedor);
        commit('setVendedor',content.info.usuario);
        router.push('home')
        Swal.close();
    }
}

export const clientePostApi = async ({ commit }, data) => {
    Swal.showLoading();

    const res = await fetch(urlApi('cliente'), {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({cliente: data})
            });
    const content = await res.json();

    if( content.error ){
        Swal.fire({
            title: 'NUEVO CLIENTE',
            text: content.msn,
            icon: 'error',
            confirmButtonColor: '#0275d8'
        });
        return false;
    }else{
        commit('setCliente',{ clienteId: content.clienteId, clienteNmb: data.nombre });
        Swal.fire({
            title: 'NUEVO CLIENTE',
            text: content.msn,
            icon: 'success',
            confirmButtonColor: '#0275d8'
        });
        return true;
    }
}

export const clientesGetApi = async ({ commit }, data) => {

    try{
        const res = await fetch(urlApi('clientes'), {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        });
        const content = await res.json();
        
        if( content.error ){
            Swal.fire({
                title: 'CLIENTES',
                text: content.info,
                icon: 'error',
                confirmButtonColor: '#0275d8',
                allowOutsideClick: false
            });
            return false;
        }else{
            commit('setClientes', content.info);
            return true;
        }

    }catch{        
        Swal.fire({
            title: 'CLIENTES',
            text: 'UN ERROR INESPERADO SE HA PRODUCIDO, FAVOR VOLVER A INTENTAR.',
            icon: 'error',
            confirmButtonColor: '#0275d8',
            allowOutsideClick: false
        });
        console.log('ERROR clientesGetApi')
    }
}