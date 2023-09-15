<template>

    <div class="container">
        <div class="row">
            <div class="col-12">
                <h1>ÚLTIMOS PEDIDOS</h1>                
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="row">
            <div class="col-12">
                <button 
                    type="button" 
                    class="btn btn-outline-primary"
                    @click="mdlFecha()">
                    BUSCAR POR FECHA
                </button>               
            </div>
        </div>
        <div class="row mt-2" v-if=" caption ">
            <div class="col-12">             
                <button
                    type="button" 
                    class="btn btn-outline-danger"
                    @click="getUltimosPedido()">
                    LIMPIAR
                </button>                
            </div>
        </div>
    </div>

    <div class="container mt-5">
        <div class="row d-flex justify-content-center">
            <div class="col">

                <div class="table-responsive">
                    <table class="table caption-top">
                        <caption>{{ caption }}</caption>
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">FECHA/<br>PEDIDO</th>
                                <th scope="col">CLIENTE/<br>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody v-if=" msn == '' ">
                            <tr v-for=" (pre,index) in preventas " :key=" pre.PREVENTA.preventa_id " @click="showDetalle(pre)">
                                <th scope="row">{{ ++index }}</th>
                                <td>
                                    {{ fechaLatinaSinHora(pre.PREVENTA.hora) }} <br>
                                    {{ pre.PREVENTA.numero }}
                                </td>
                                <td>
                                    {{ pre.PREVENTA.retira_nombre }} <br>
                                    {{ formatDinero(pre.PREVENTA.total) }}
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="3">{{ msn }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>

    <!-- MODAL DETALLE VENTA -->
    <div class="modal fade" id="mdlDetalle" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" v-if=" preventa ">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">DETALLE {{ preventa.PREVENTA.numero }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <table class="table caption-top">
                        <caption>VENTA</caption>
                        <tbody>
                            <tr>
                                <th class="table-dark">CÓDIGO</th>
                                <td>{{ preventa.PREVENTA.numero }}</td>
                            </tr>
                            <tr>
                                <th class="table-dark">FECHA</th>
                                <td>{{ fechaLatina(preventa.PREVENTA.hora) }}</td>
                            </tr>
                            <tr>
                                <th class="table-dark">CLIENTE</th>
                                <td>{{ preventa.PREVENTA.retira_nombre }}</td>
                            </tr>
                            <tr>
                                <th class="table-dark">VENDEDOR</th>
                                <td>{{ preventa.VENDEDOR.usuario_nombre }}</td>
                            </tr>
                            <tr>
                                <th class="table-dark">TOTAL</th>
                                <td>{{ formatDinero(preventa.PREVENTA.total) }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table caption-top" v-for=" det in preventa.DETALLE " :key=" det ">
                        <caption>{{ det.detalle }}</caption>
                        <tbody>
                            <tr>
                                <th class="table-dark">COD. ART.</th>
                                <td>{{ det.codigo }}</td>
                            </tr>
                            <tr>
                                <th class="table-dark">PRECIO</th>
                                <td>{{ formatDinero(det.precio) }}</td>
                            </tr>
                            <tr>
                                <th class="table-dark">CANTIDAD</th>
                                <td>{{ det.cantidad }}</td>
                            </tr>
                            <tr>
                                <th class="table-dark">TOTAL</th>
                                <td>{{ formatDinero(det.total_retira) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    

                </div>
                <div class="modal-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        data-bs-dismiss="modal">
                        SALIR
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL FILTRO FECHA -->
    <div class="modal fade" id="mdlfecha" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">BUSCAR POR FECHAS</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <form>
                        <fieldset>
                            <legend>BUSCAR POR DÍA</legend>
                                <div class="mb-3">
                                    <label class="form-label">SELECCIONAR DÍA</label>
                                    <input type="date" class="form-control" v-model="fecha.unica" @input="validateFecha(1)" >
                                </div>
                        </fieldset>
                    </form>                    
                    
                    <form>
                        <fieldset>
                            <legend>BUSCAR ENTRE FECHAS</legend>
                                <div class="mb-3">
                                    <label class="form-label">DESDE</label>
                                    <input type="date" class="form-control" v-model="fecha.desde" @input="validateFecha(2)">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">HASTA</label>
                                    <input type="date" class="form-control" v-model="fecha.hasta" @input="validateFecha(3)">
                                </div>
                        </fieldset>
                    </form>                    
                    

                </div>
                <div class="modal-footer">
                    <button 
                        type="button" 
                        class="btn btn-secondary" 
                        data-bs-dismiss="modal">
                        SALIR
                    </button>
                    <button 
                        type="button" 
                        class="btn btn-outline-primary"
                        @click="searchDate()"
                        v-html=" btnFecha.txt "
                        :disabled=" btnFecha.disabled ">
                    </button>
                </div>
            </div>
        </div>
    </div>    

</template>

<script>
import { urlApi, fechaLatina, fechaLatinaSinHora, formatDinero, dateIsValid } from "../../shared/helpers/helpers"

export default {
    components: {
    },
    data(){
        return{
            preventas: {},
            preventa: null,
            fecha: {},
            msn: '',
            caption: '',
            btnFecha: {
                txt: 'BUSCAR',
                disabled: true
            },
        }
    },

    created(){
        this.instanciar();
    },

    methods: {
        urlApi,
        fechaLatina,
        fechaLatinaSinHora,
        formatDinero,
        instanciar(){
            this.getUltimosPedido();
        },
        async getUltimosPedido(){
            Swal.showLoading();
            this.caption    = '';
            this.msn        = '';
            const titleAccion   = 'ÚLTIMOS PEDIDOS';

            try{
                const res = await fetch(urlApi('ultimos'), {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    }
                });
                const content = await res.json();
                if( content.error ){
                    this.swalErrorText(titleAccion, content.info);
                }else{
                    this.preventas = content.info.res;
                    if( content.info.res == '0' ){
                        this.msn = 'SIN REGISTROS ENCONTRADOS';
                    }                    
                }
                Swal.close();

            }catch{
                this.swalLog(titleAccion);
                console.log('ERROR getUltimosPedido')
            }
        },
        showDetalle(value){
            this.preventa = value;
            this.showModal();
        },
        showModal(){
            Swal.showLoading();
            setTimeout(() => {
                $('#mdlDetalle').modal('show');
                Swal.close();
            }, 500);
        },
        mdlFecha(){
            Swal.showLoading();
            this.fecha = {};
            setTimeout(() => {
                $('#mdlfecha').modal('show');
                Swal.close();
            }, 500);
        },
        validateFecha(value){
            const titleAccion = 'FECHA';
            const textoAccion = 'FECHA NO VÁLIDA';

            switch (value) {
                case 1:
                    this.fecha.desde = '';
                    this.fecha.hasta = '';
                    if( !dateIsValid(this.fecha.unica) ) this.swalErrorText(titleAccion, textoAccion);
                    break;
                case 2:
                    this.fecha.unica = '';
                    if( !dateIsValid(this.fecha.desde) ) this.swalErrorText(titleAccion, textoAccion);
                    break;
                case 3:
                    this.fecha.unica = '';
                    if( !dateIsValid(this.fecha.hasta) ) this.swalErrorText(titleAccion, textoAccion);
                    break;
            }

            if( this.fecha.unica || ( this.fecha.desde && this.fecha.hasta ) ){
                this.btnFechaLoad(false, false);
            }else{
                this.btnFechaLoad(false, true);
            }

        },
        async searchDate(){
            Swal.showLoading();
            const titleAccion   = 'ÚLTIMOS PEDIDOS';

            try{
                const res = await fetch(urlApi('search'), {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({fecha: this.fecha})
                });
                const content = await res.json();

                if( content.error ){
                    this.swalErrorText(titleAccion, content.info);
                }else{
                    $('#mdlfecha').modal('hide');
                    this.caption = content.caption;
                    this.preventas = content.info.res;
                    if( content.info.res == '0' ){
                        this.msn = 'SIN REGISTROS ENCONTRADOS';
                    }else{
                        this.msn = '';
                    }
                }
                Swal.close();

            }catch{
                this.swalLog(titleAccion);
                console.log('ERROR searchDate')
            }
        },
        goHome(){
            this.$router.push({ name: 'home' });
        },
        txtBtnLoad(){
            return '<i class="fas fa-sync-alt fa-spin"></i> PROCESANSO...';
        },
        btnFechaLoad(load, dis){
            this.btnFecha.txt = load ? this.txtBtnLoad() : 'BUSCAR'
            this.btnFecha.disabled = dis;
        },
        swalLoading(title, txtText, buttonText, buttonColor, accion){
            const self = this;
            Swal.fire({
                title: title,
                text: txtText,
                showCancelButton: true,
                confirmButtonText: buttonText,
                confirmButtonColor: buttonColor,
                cancelButtonText: 'CANCELAR',
                cancelButtonColor: '#6c757d',
                allowOutsideClick: false
            }).then((result) => {
                if( result.isConfirmed ){
                    Swal.showLoading();
                    
                    switch (accion) {
                        case 1:
                            self.procesarPedido();
                            break;
                        case 2:
                            self.pedido         = [];
                            self.pedidoTotal    = ''
                            self.cliente        = '';
                            Swal.fire( 'PEDIDO ELIMINADO', 'PEDIDO ELIMINADO CON ÉXITO', 'success');
                            self.instanciar();
                            break;
                        case 3:
                            self.deleteProcess();
                            Swal.fire( 'ARTÍCULO ELIMINADO', 'ARTÍCULO ELIMINADO CON ÉXITO', 'success');
                            break;
                    }
                }
            });
        },
        swalSuccess(titleAccion, textAccion){
            Swal.fire({
                title: titleAccion,
                text: textAccion,
                icon: 'success',
                confirmButtonColor: '#0275d8',
                allowOutsideClick: false
            });
        },
        swalError(titleAccion){
            Swal.fire({
                title: titleAccion,
                text: 'UN ERROR INESPERADO SE HA PRODUCIDO, FAVOR VOLVER A INTENTAR.',
                icon: 'error',
                confirmButtonColor: '#0275d8',
                allowOutsideClick: false
            });
        },
        swalErrorText(titleAccion, textoAccion){
            Swal.fire({
                title: titleAccion,
                text: textoAccion,
                icon: 'error',
                confirmButtonColor: '#0275d8',
                allowOutsideClick: false
            });
        },
        swalLog(titleAccion){
            Swal.fire({
                title: titleAccion,
                text: '* UN ERROR INESPERADO SE HA PRODUCIDO, FAVOR VOLVER A INTENTAR.',
                icon: 'error',
                confirmButtonColor: '#0275d8',
                allowOutsideClick: false
            });
        },
    }
}
</script>

<style scoped>
.menu{
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	align-content: center;   
}
</style>