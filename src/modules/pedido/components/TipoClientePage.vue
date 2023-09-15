<template>

    <div class="container mt-5">
        <div class="row">
            <div class="col-12 d-flex justify-content-around">
                <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    @click="tipoCliente('cliente-frecuente')">
                    CLIENTE FRECUENTE
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    @click="tipoCliente('cliente-no-frecuente')">
                    CLIENTE NO FRECUENTE
                </button>
                <NuevoClientePage />
            </div>
        </div>
    </div>

    

</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    components: {
        NuevoClientePage: defineAsyncComponent(() => import('../components/NuevoClientePage.vue')),

    },

    methods: {
        tipoCliente(value){
            this.$store.commit('st/setTipoCliente', value);
        },
    }

}
</script>

<style>

</style>