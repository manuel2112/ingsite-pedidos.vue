<template>

    <div class="container mt-5">
        <div class="row">
            <div class="col">
                <button 
                    type="button"
                    class="btn btn-lg btn-outline-primary"
                    @click="goPedido()">
                    INGRESAR PEDIDO
                </button>
            </div>
            <div class="col">
                <button 
                    type="button"
                    class="btn btn-lg btn-outline-primary"
                    @click="goLast()">
                    ÚLTIMOS PEDIDOS
                </button>
            </div>
        </div>
    </div>

</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    components: {
    },
    data(){
        return{
        }
    },

    created(){
    },

    methods: {
        goPedido(){
            this.$store.commit('st/setTipoCliente', '');
            this.$router.push({ name: 'pedido' });
        },
        goLast(){
            this.$router.push({ name: 'ultimos' });
        },
    }
}
</script>

<style>

</style>