<template>
    <button
        type="button"
        class="btn btn-sm btn-outline-primary"
        data-bs-toggle="modal"
        data-bs-target="#mdlNuevoCliente">
        CLIENTE NUEVO
    </button>

    <!-- MODAL NUEVO CLIENTE -->
    <div class="modal fade" id="mdlNuevoCliente" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent=" addCliente() ">
                    <div class="modal-header">
                        <h5 class="modal-title">NUEVO CLIENTE</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="col-12">
                            <input 
                                type="text" 
                                class="form-control"
                                :class=" clienteError.rut && 'is-invalid'"
                                placeholder="RUT"
                                v-model="cliente.rut">
                            <div class="invalid-feedback text-start"> RUT NO VÁLIDO. </div>
                        </div>

                        <div class="col-12 mt-2">
                            <input 
                                type="text" 
                                class="form-control"
                                :class=" clienteError.nombre && 'is-invalid'" 
                                placeholder="* NOMBRE/RAZÓN SOCIAL"
                                v-model="cliente.nombre"
                                required>
                            <div class="invalid-feedback text-start"> NOMBRE/RAZÓN SOCIAL OBLIGATORIO. </div>
                        </div>

                        <div class="col-12 mt-2">
                            <input 
                                type="text" 
                                class="form-control" 
                                :class=" clienteError.direccion && 'is-invalid'" 
                                placeholder="* DIRECCIÓN"
                                v-model="cliente.direccion"
                                required>
                            <div class="invalid-feedback text-start"> DIRECCIÓN OBLIGATORIA. </div>
                        </div>

                        <div class="col-12 mt-2">
                            <input 
                                type="text" 
                                class="form-control" 
                                :class=" clienteError.ciudad && 'is-invalid'" 
                                placeholder="* CIUDAD"
                                v-model="cliente.ciudad"
                                required>
                            <div class="invalid-feedback text-start"> CIUDAD OBLIGATORIA. </div>
                        </div>

                        <div class="col-12 mt-2">
                            <input 
                                type="text" 
                                class="form-control " 
                                :class=" clienteError.fono && 'is-invalid'"
                                placeholder="* TELÉFONO"
                                v-model="cliente.fono"
                                required>
                            <div class="invalid-feedback text-start"> TELÉFONO OBLIGATORIO. </div>
                        </div>

                        <div class="col-12 mt-2">
                            <label :class=" clienteError.credito && 'text-danger is-invalid'">¿TENDRÁ CRÉDITO?</label><br />
                            <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                                <input 
                                    type="radio" 
                                    class="btn-check" 
                                    name="btnradio" 
                                    id="btnradio1"
                                    v-model="cliente.credito"
                                    value="TRUE">
                                <label class="btn btn-outline-primary" for="btnradio1">SI</label>

                                <input 
                                    type="radio" 
                                    class="btn-check" 
                                    name="btnradio" 
                                    id="btnradio2"
                                    v-model="cliente.credito"
                                    value="FALSE">
                                <label class="btn btn-outline-primary" for="btnradio2">NO</label>
                            </div>
                            <div class="invalid-feedback text-center"> SELECCIONAR UNA OPCIÓN. </div>
                        </div>

                        <div class="col-12 mt-2" v-if=" cliente.credito === 'TRUE' ">
                            <input 
                                type="number" 
                                class="form-control " 
                                :class=" clienteError.monto && 'is-invalid'"
                                placeholder="* MONTO CRÉDITO"
                                v-model="cliente.monto"
                                required>
                            <div class="invalid-feedback text-start"> MONTO CRÉDITO OBLIGATORIO. </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CERRAR</button>
                        <button 
                            type="submit" 
                            class="btn btn-primary">
                            AGREGAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import { validate, format } from 'rut.js'

export default {
    data(){
        return{
            cliente: {},
            clienteError: {},
        }
    },

    created(){
        this.instanciar();
    },

    methods: {
        ...mapActions('st',['clientePostApi', 'clientesGetApi']),
        instanciar(){
            this.cliente= {};
        },
        async addCliente(){

            if( this.cliente.rut ){
                if ( !validate(this.cliente.rut) ){
                    this.clienteError.rut = true;
                    return;
                }else{
                    this.cliente.rut = format(this.cliente.rut);
                    this.clienteError.rut = false;
                }
            }else{
                this.cliente.rut = '';
                this.clienteError.rut = false;
            }

            if ( !this.cliente.nombre.trim() ){
                this.clienteError.nombre = true;
                return;
            }else{
                this.cliente.nombre = this.cliente.nombre.toUpperCase();
                this.clienteError.nombre = false;
            }

            if ( !this.cliente.direccion.trim() ){
                this.clienteError.direccion = true;
                return;
            }else{
                this.cliente.direccion = this.cliente.direccion.toUpperCase();
                this.clienteError.direccion = false;
            }

            if ( !this.cliente.ciudad.trim() ){
                this.clienteError.ciudad = true;
                return;
            }else{
                this.cliente.ciudad = this.cliente.ciudad.toUpperCase();
                this.clienteError.ciudad = false;
            }

            if ( !this.cliente.fono.trim() ){
                this.clienteError.fono = true;
                return;
            }else{
                this.clienteError.fono = false;
            }

            if ( !this.cliente.credito ){
                this.clienteError.credito = true;
                return;
            }else{
                this.clienteError.credito = false;
            }

            if ( (this.cliente.credito === 'TRUE') && (this.cliente.monto <= 0) ){
                this.clienteError.monto = true;
                return;
            }else{
                this.clienteError.monto = false;
            }
            
            await this.clientePostApi(this.cliente)
            .then( res => {
                    if( res ){
                        this.clientesGetApi().then( resp => {
                            if( resp ){
                                $('#mdlNuevoCliente').modal('hide');
                                this.cliente = {};
                                this.$store.commit('st/setTipoCliente', 'nuevo-cliente');
                            }
                        });
                    }
                }
            );
        }
    }

}
</script>

<style>

</style>