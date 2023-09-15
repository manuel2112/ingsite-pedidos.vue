<template>
    <div class="container">
        <div class="row">
            <div :class=" getVendedor.nombre ? 'col-6' : 'col-12' ">
                <img alt="Vue logo" src="../assets/logo-juane.png" class="img-fluid logo">
            </div>
            <div class="col-6 menu" v-if="getVendedor.nombre">
                <div>
                    <button type="button" class="btn btn-outline-primary" @click="goHome()">
                        <i class="fa fa-home"></i>
                    </button>
                </div>
                <div>
                    
                    <button 
                        type="button" 
                        class="btn btn-sm btn-outline-danger" 
                        @click="cerrarSesion()">
                        {{ getVendedor.nombre }} <i class="fa fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { cerrarSesion, getWithExpiry } from "../modules/shared/helpers/helpers";

export default {

    data(){
        return{
        }
    },
    computed:{
        ...mapGetters('st',['getVendedor'])
    },

    created(){
        this.instanciar();
    },

    methods: {
        cerrarSesion,
        getWithExpiry,
        instanciar(){
            if(!getWithExpiry()){
                this.cerrarSesion();
            }else{
                const { vendedor } = getWithExpiry();
                if( !this.getVendedor.id ){
                    this.$store.commit('st/setVendedor', vendedor);
                }
            }
        },
        goHome(){
            this.$router.push({ name: 'home' });
            // if( this.pedido.length == 0 ){
            //     this.$router.push({ name: 'home' });
            // }else{
            //     const title         = "¿ESTÁS SEGURO?";
            //     const txtText       = 'TIENES UN PEDIDO PENDIENTE, LO DESEAS CANCELAR';
            //     const buttonText    = 'SI, IR A LA PORTADA';
            //     const buttonColor   = "#198754";
            //     const accion        = 4;

            //     this.swalLoading(title, txtText, buttonText, buttonColor, accion);
            // }
        },
    }
}
</script>

<style>
.menu{
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: flex-end;
	align-content: flex-end; 
}
img.logo{
    max-height: 200px;
}
</style>