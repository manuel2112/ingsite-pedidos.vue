<template>
    
    <TipoClientePage v-if=" getTipoCliente == '' " />
    
    <div class="container" v-if=" getTipoCliente == 'nuevo-cliente' ">
        <div class="row">
            <div class="forms-inputs mt-4 mb-4"> 
                <span>CLIENTE</span> 
                <input 
                    autocomplete="off" 
                    type="text" 
                    class="form-control"
                    placeholder="cliente"
                    :value=" getCliente.clienteNmb "
                    disabled="true">
            </div>            
        </div>
    </div>

    <div class="container" v-if=" getTipoCliente == 'cliente-no-frecuente' ">
        <div class="row">
            <div class="forms-inputs mt-4 mb-4"> 
                <span>INGRESAR CLIENTE</span> 
                <input 
                    autocomplete="off" 
                    type="text" 
                    class="form-control"
                    placeholder="INGRESAR CLIENTE"
                    @input="validarNoFrecuente"
                    v-model="clienteTxt">
            </div>            
        </div>
    </div>

    <div class="container" v-if=" getTipoCliente == 'cliente-frecuente' ">
        <div class="row">
            <div class="col-12">
                <div class="forms-inputs mt-4 mb-4"> <span>SELECCIONAR/BUSCAR CLIENTE</span> 
                <input 
                    autocomplete="off" 
                    type="text" 
                    class="form-control"
                    ref="cliente"
                    placeholder="INGRESAR/BUSCAR CLIENTE"
                    v-model.trim="clienteTxt"
                    @input="filtrarClientes"
                    :disabled="clienteInputDisabled">
                </div>
            </div>
            <div class="col-12" v-if="isVisibleClientes">
                <div class="box-list">
                    <ul class="list-group">
                        <li 
                            v-for=" cli in clientesTemps " 
                                class="list-group-item"
                                :key=" cli.CLIENTE.clientes_id "
                                @click=" selectCliente(cli) ">
                            {{ cli.CLIENTE.razon }}<br>
                            {{ cli.CLIENTE.rut }}<br>
                            <span 
                                class="text-danger" 
                                v-if=" cli.DEBE[0].debe > 0 ">
                                {{ formatDinero(cli.DEBE[0].debe) }}
                            </span>
                            <span 
                                class="text-primary" 
                                v-if="cli.DEBE[0].debe <= 0 && (cli.DEBE[0].debe != null) ">
                                {{ formatDinero(cli.DEBE[0].debe * -1) }}
                            </span>
                            <span 
                                class="text-primary" 
                                v-if=" !cli.DEBE[0].debe ">
                                SIN SALDO
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    
    <div class="container mb-3" v-if=" (getTipoCliente == 'nuevo-cliente') ">
        <div class="row">
            <div class="col-12 d-flex justify-content-around">
                <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#mdlProducto"
                    @click="mdlReset()"
                    v-html=" btnAgregarProducto.txt ">
                </button>
            </div>
        </div>
    </div>
    <div class="container mb-3" v-if=" (getTipoCliente == 'cliente-no-frecuente') ">
        <div class="row">
            <div class="col-12 d-flex justify-content-around">
                <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#mdlProducto"
                    @click="mdlReset()"
                    v-html=" btnAgregarProducto.txt "
                    :disabled=" btnAgregarProducto.disabled ">
                </button>
            </div>
        </div>
    </div>
    <div class="container mb-3" v-if=" (getTipoCliente == 'cliente-frecuente') && getCliente?.clienteNmb ">
        <div class="row">
            <div class="col-12 d-flex justify-content-around">
                <button
                    type="button"
                    class="btn btn-sm btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#mdlProducto"
                    @click="mdlReset()"
                    v-html=" btnAgregarProducto.txt "
                    :disabled=" btnAgregarProducto.disabled ">
                </button>
                <button
                    v-if=" (this.pedido.length == 0) "
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    @click="limpiarCliente">
                    CAMBIAR CLIENTE
                </button>
            </div>
        </div>
    </div>
    
    <!-- RESÚMEN PEDIDO -->
    <div class="container" v-if=" pedido != '' ">
        <div class="row">
            <div class="col-12">

                <div class="table-responsive">
                    <table class="table">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">PRODUCTO</th>
                                <th scope="col">CANT.</th>
                                <th scope="col">VALOR</th>
                                <th scope="col">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for=" (ped,index) in pedido " :key=" ped.articulos_id ">
                                <th scope="row">
                                    <button 
                                        type="button" 
                                        class="btn btn-sm btn-outline-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#mdlEditProducto"
                                        @click="getArticulo(ped,index)">
                                        {{ ++index }}
                                    </button>
                                </th>
                                <td>{{ ped.articulos_descripcion }}</td>
                                <td>{{ ped.cantidad }}</td>
                                <td>{{ formatDinero(ped.articulos_venta) }}</td>
                                <td>{{ formatDinero(ped.total) }}</td>
                            </tr>
                            <tr class="table-dark">
                                <td colspan="4">TOTAL</td>
                                <td>{{ formatDinero(pedidoTotal) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </div>

            <div class="col-12 btn-grid">
                <button 
                    type="button" 
                    class="btn btn-outline-danger"
                    @click="limpiarPedido()">
                    LIMPIAR
                </button>
                <button 
                    type="button" 
                    class="btn btn-outline-success"
                    @click="realizarPedido()"
                    v-html=" btnPedido.txt "
                    :disabled=" btnPedido.disabled ">
                </button>
            </div>
        </div>
    </div>

    <!-- MODAL PEDIDO -->
    <div class="modal fade" id="mdlProducto" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent=" addArticulo() ">
                    <div class="modal-header">
                        <h5 class="modal-title">SELECCIONAR PRODUCTO</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <div class="container">
                            <div class="row">

                                <div class="col-12">
                                    <h5>BUSCAR POR</h5>                                

                                    <div class="btn-group mb-3">
                                        <label class="btn btn-outline-primary">
                                            <input type="radio" class="btn-check" name="buscarpor" @change="buscarPor($event)" value="1">PRODUCTO
                                        </label>

                                        <label class="btn btn-outline-primary">
                                            <input type="radio" class="btn-check" name="buscarpor" @change="buscarPor($event)" value="2">FAMILIA
                                        </label>

                                        <!-- <label class="btn btn-outline-primary">
                                            <input type="radio" class="btn-check" name="buscarpor" @change="buscarPor($event)" value="3">CÓD. BARRAS
                                        </label> -->
                                    </div>
                                </div>

                                <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" v-if="openCam"></StreamBarcodeReader>
                                <!-- <ImageBarcodeReader @decode="onDecode" @error="onError" v-if="openCam"></ImageBarcodeReader> -->
                                
                                <div class="col-12" v-if="searchByFamily">
                                    <div class="form-group mb-3">
                                        <div class="input-group">
                                            <select
                                            class="form-select"
                                            v-model.trim=" familia "
                                            @change="selectFamily()">
                                            
                                            <option value=""> SELECCIONAR FAMILIA...</option>
                                            <option v-for=" fam in familias " :key=" fam.familia_id " :value=" fam ">
                                                {{ fam.familia_nombre }}</option>
                                            </select>
                                        </div>
                                    </div>	
                                </div>

                                <div class="col-12" v-if="isVisibleProducto">

                                    <div class="box-search">

                                        <div class="input-group input-group-sm mb-3 form-search">
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                placeholder="BUSCAR PRODUCTO"
                                                v-model="search"
                                                @input="filterSearch()">
                                            <span class="input-group-text"><i class="fas fa-search-plus"></i></span>
                                        </div>

                                        <div class="box-list">
                                            <ul class="list-group">
                                                <li 
                                                    v-for=" art in articulosTemp " 
                                                    class="list-group-item"
                                                    :key=" art.articulos_id "
                                                    @click=" art.articulos_stock > 0 ? selectArticulo(art) : null">
                                                    {{ art.articulos_descripcion }}<br>
                                                    <small :class=" art.articulos_stock > 0 ? 'text-primary' : 'text-danger'">PRECIO {{ formatDinero(art.articulos_venta) }}</small><br>
                                                    <small :class=" art.articulos_stock > 0 ? 'text-primary' : 'text-danger'">STOCK {{ art.articulos_stock }} UN.</small>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>

                                </div>
                                
                                <div class="col-12">
                                    <small>{{ msnError }}</small>

                                    <div class="box-search" v-if="isVisibleFamilia">

                                        <div class="input-group input-group-sm mb-3 form-search">
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                placeholder="BUSCAR PRODUCTO"
                                                v-model="search"
                                                @input="filterSearch2()">
                                            <span class="input-group-text"><i class="fas fa-search-plus"></i></span>
                                        </div>

                                        <div class="box-list">
                                            <ul class="list-group">
                                                <li 
                                                    class="list-group-item"
                                                    v-for=" art in articulosPorFamiliaTemp " :key=" art.articulos_id "
                                                    @click="selectArticulo(art)">
                                                    {{ art.articulos_descripcion }}<br>
                                                    <small :class=" art.articulos_stock > 0 ? 'text-primary' : 'text-danger'">PRECIO {{ formatDinero(art.articulos_venta) }}</small><br>
                                                    <small :class=" art.articulos_stock > 0 ? 'text-primary' : 'text-danger'">STOCK {{ art.articulos_stock }} UN.</small>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                        
                        <div class="container mt-3" v-if=" articulo ">
                            <div class="row">
                                <div class="col">
                                    <small>ARTÍCULO</small>
                                    <input type="text" class="form-control" :value=" articulo.articulos_descripcion " disabled>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <small>CÓDIGO</small>
                                    <input type="text" class="form-control" :value=" articulo.articulos_codigo " disabled>
                                </div>
                                <div class="col">
                                    <small>PRECIO VENTA</small>
                                    <input type="text" class="form-control" :value=" articulo.articulos_venta " disabled>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <small>STOCK</small>
                                    <input type="text" class="form-control" :value=" articulo.articulos_stock " disabled>
                                </div>
                                <div class="col">
                                    <small>UNIDAD</small>
                                    <input type="text" class="form-control" :value=" articulo.articulos_unidad " disabled>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <small>CANTIDAD</small>
                                    <input 
                                        type="number" 
                                        class="form-control" 
                                        v-model=" articulo.cantidad "
                                        ref="cInputInsert"
                                        @input="calcCantidad" 
                                        :disabled="cantDisabled">
                                </div>
                                <div class="col-6">
                                    <small>TOTAL $:</small>
                                    <input type="text" class="form-control" :value=" articulo.total " disabled>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CERRAR</button>
                        <button 
                            type="submit" 
                            class="btn btn-primary" 
                            v-html=" btnAgregar.txt " 
                            :disabled=" btnAgregar.disabled ">
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- MODAL EDIT ARTÍCULO -->
    <div class="modal fade" id="mdlEditProducto" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent=" editArticulo() ">
                    <div class="modal-header">
                        <h5 class="modal-title">EDITAR {{ articuloEdit.articulos_descripcion }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        
                        <div class="container mt-3">
                            <div class="row">
                                <div class="col">
                                    <small>ARTÍCULO</small>
                                    <input type="text" class="form-control" :value=" articuloEdit.articulos_descripcion " disabled>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <small>CÓDIGO</small>
                                    <input type="text" class="form-control" :value=" articuloEdit.articulos_codigo " disabled>
                                </div>
                                <div class="col">
                                    <small>PRECIO VENTA</small>
                                    <input type="text" class="form-control" :value=" articuloEdit.articulos_venta " disabled>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <small>STOCK</small>
                                    <input type="text" class="form-control" :value=" articuloEdit.articulos_stock " disabled>
                                </div>
                                <div class="col">
                                    <small>UNIDAD</small>
                                    <input type="text" class="form-control" :value=" articuloEdit.articulos_unidad " disabled>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <small>CANTIDAD</small>
                                    <input 
                                        type="number" 
                                        class="form-control"
                                        v-model=" cantEdit " 
                                        ref="cantEdit"
                                        @input=" calcCantidadEdit ">
                                </div>
                                <div class="col-6">
                                    <small>TOTAL $:</small>
                                    <input type="text" class="form-control" :value=" totalEdit " disabled>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CERRAR</button>
                        <button 
                            type="button" 
                            class="btn btn-danger"
                            @click="deleteArticulo()">
                            ELIMINAR
                        </button>
                        <button 
                            type="submit"
                            class="btn btn-primary"
                            v-html=" btnEditar.txt "
                            :disabled=" btnEditar.disabled ">
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapActions, mapGetters } from "vuex";
import { urlApi, formatDinero } from "../../shared/helpers/helpers"

export default {
    components: {
        TipoClientePage: defineAsyncComponent(() => import('../components/TipoClientePage.vue')),
        StreamBarcodeReader: defineAsyncComponent(() => import('../components/StreamBarcodeReader.vue')),
        ImageBarcodeReader: defineAsyncComponent(() => import('../components/ImageBarcodeReader.vue')),

    },
    data(){
        return{
            initLoading: true,
            clienteSelected: '',
            clienteInputDisabled: false,
            clienteTxt: '',
            clientes: null,
            clientesTemps: null,
            articulos: null,
            articulosTemp: null,
            articulo: '',
            articuloEdit: '',
            articulosPorFamilia: null,
            articulosPorFamiliaTemp: null,
            familias: null,
            familia: '',
            pedido: [],
            pedidoTotal: '',
            cantDisabled: true,
            isVisibleClientes: true,
            isVisibleProducto: false,
            isVisibleFamilia: false,
            searchByFamily: false,
            searchByBarCode: false,
            openCam: false,
            msnError: '',
            search: '',
            indice: '',
            cantEdit: '',
            totalEdit: '',
            isStock: false,
            iSelect: '<i class="fas fa-angle-down"></i>',
            btnAgregar: {
                txt: 'AGREGAR',
                disabled: true
            },
            btnEditar: {
                txt: 'EDITAR',
                disabled: true
            },
            btnPedido: {
                txt: 'REALIZAR PEDIDO',
                disabled: true
            },
            btnAgregarProducto: {
                txt: 'AGREGAR PRODUCTO',
                disabled: true
            },
        }
    },
    computed:{
        ...mapGetters('st',['getVendedor', 'getClientes', 'getClientesTemp', 'getTipoCliente', 'getCliente'])
    },

    created(){
        this.instanciar();
    },

    methods: {
        urlApi,
        formatDinero,
        ...mapActions('st',['clientesGetApi']),
        instanciar(){            
            this.focusOnCliente();
            this.getArticulos();
            this.clientesGetApi().then( res => {
                if( res ){
                    this.listClientes();
                }
            });
        },
        listClientes(){
            this.clientesTemps = this.getClientes;
        },
        async getArticulos(){
            // this.initLoading ? Swal.showLoading() : '';
            const titleAccion   = 'PRODUCTOS';

            try{
                const res = await fetch(urlApi('articulos'), {
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
                    this.articulos      = content.info.articulos;
                    this.articulosTemp  = content.info.articulos;
                    this.familias       = content.info.familias;
                    this.isStock        = content.stock;
                }
                // this.initLoading ? Swal.close() : '';
                // this.initLoading = false;

            }catch{
                this.swalLog(titleAccion);
                console.log('ERROR getArticulos')
            }
        },
        onDecode (result) {
            this.openCam    = false;
            this.filterSearch3(result);
        },
        onLoaded () { 
        },
        onError (e) {
            // console.log(e)
            // this.swalErrorText('ACCIÓN CON LA CÁMARA', e);
        },
        mdlReset(){
            this.isVisibleProducto      = false;
            this.articulo               = '';
            this.articulosPorFamilia    = null
            this.familia                = '';
            this.iSelect                = '<i class="fas fa-angle-down"></i>';
            this.searchByFamily         = false;
            this.searchByBarCode        = false;
            this.openCam                = false;
            this.msnError               = '';
            this.search                 = '';
            this.validarCompra();
        },
        filtrarClientes(){
            this.clientesTemps  = this.getClientes;
            this.clienteTxt     = this.clienteTxt.toUpperCase();
            const str           = this.clienteTxt;
            let filtro          = [];
            this.clientesTemps.map((cli) => {
                if( cli.CLIENTE.razon.includes(str) ){
                    filtro.push( cli );
                }
            });
            this.clientesTemps = filtro;
        },
        // validarCliente(){
        //     this.cliente = this.cliente.toUpperCase();
        //     this.validarCompra();
        //     if( this.cliente ){
        //         this.btnAgregarProductoLoad(false, false);
        //     }else{
        //         this.btnAgregarProductoLoad(false, true);
        //     }
        // },
        validarCompra(){
            if( this.getCliente.clienteNmb && (this.pedido.length > 0) ){
                this.btnPedidoLoad(false, false);
            }else{
                this.btnPedidoLoad(false, true);
            }
        },
        addArticulo(){
            Swal.showLoading();
            this.pedido.push( this.articulo );
            const sumall = this.pedido.map(item => item.total).reduce((prev, curr) => prev + curr, 0);
            this.pedidoTotal = sumall;
            this.articulo = '';
            this.btnAgregar.disabled = true;
            this.validarCompra();
            $('#mdlProducto').modal('hide');
            Swal.close();
        },
        editArticulo(){
            Swal.showLoading();
            this.articuloEdit.cantidad  = this.cantEdit;
            this.articuloEdit.total     = this.totalEdit;
            const sumall                = this.pedido.map(item => item.total).reduce((prev, curr) => prev + curr, 0);
            this.pedidoTotal            = sumall;
            this.articuloEdit           = '';
            $('#mdlEditProducto').modal('hide');
            Swal.close();
        },
        deleteArticulo(){
            const title         = "¿ESTÁS SEGURO?";
            const txtText       = 'SE ELIMINARÁ ESTE ARTÍCULO';
            const buttonText    = 'SI, ELIMINAR ARTÍCULO';
            const buttonColor   = "#d9534f";
            const accion        = 3;

            this.swalLoading(title, txtText, buttonText, buttonColor, accion);
        },
        deleteProcess(){
            const arr = this.pedido[this.indice];
            this.pedido.splice(this.indice, 1);
            const sumall        = this.pedido.map(item => item.total).reduce((prev, curr) => prev + curr, 0);
            this.pedidoTotal    = sumall;
            this.filterSearch4(arr.articulos_id);
            $('#mdlEditProducto').modal('hide');
        },
        focusOnCliente(){
            // setTimeout(() => {
            //     this.$refs.cliente.focus();
            // }, 500);
        },
        focusOnEditButton(){
            setTimeout(() => {
                this.$refs.cantEdit.focus();
            }, 500);
        },
        getArticulo(value,i){
            this.indice         = --i;
            this.articuloEdit   = value;
            this.cantEdit       = value.cantidad;
            this.totalEdit      = value.total;
            this.focusOnEditButton();
        },
        calcCantidad(){
            this.articulo.total = this.articulo.cantidad * this.articulo.articulos_venta;
            if( this.articulo.total > 0 ){
                if( (this.articulo.cantidad <= parseInt(this.articulo.articulos_stock)) || !this.isStock ){
                    this.btnAgregarLoad(false, false);
                }else{
                    this.swalErrorText('ARTÍCULO', 'LA CANTIDAD INGRESADA DEBE SER MENOR/IGUAL AL STOCK EXISTENTE');
                    this.btnAgregarLoad(false, true); 
                }                
            }else{
                this.btnAgregarLoad(false, true);                
            }
        },
        calcCantidadEdit(){
            this.totalEdit = this.cantEdit * this.articuloEdit.articulos_venta;
            if( this.totalEdit > 0 ){
                if( this.cantEdit <= parseInt(this.articuloEdit.articulos_stock) ){
                    this.btEditarLoad(false, false);
                }else{
                    this.swalErrorText('ARTÍCULO', 'LA CANTIDAD INGRESADA DEBE SER MENOR/IGUAL AL STOCK EXISTENTE');
                    this.btEditarLoad(false, true); 
                }
            }else{                
                this.btEditarLoad(false, true);                
            }
        },
        buscarPor(e){
            this.mdlReset();
            const valor = e.target.value;
            switch (valor) {
                case '1':
                    this.searchByFamily     = false;
                    this.searchByBarCode    = false;
                    this.isVisibleFamilia   = false;
                    this.showBox();
                    break;
                case '2':
                    this.searchByFamily     = true;
                    this.searchByBarCode    = false;
                    this.isVisibleFamilia   = false;
                    break;
                case '3':
                    this.searchByFamily     = false;
                    this.searchByBarCode    = true;
                    this.openCam            = true;
                    this.isVisibleFamilia   = false;
                    break;
            }
            const ele = document.getElementsByName("buscarpor");
            for(var i=0;i<ele.length;i++)
            ele[i].checked = false;
        },
        resetBuscarPor(){
            this.searchByFamily     = false;
            this.searchByBarCode    = false;
            this.isVisibleProducto  = false;
            this.isVisibleFamilia   = false;
            this.cantDisabled       = false;
        },
        selectFamily(){
            this.search = '';
            const str           = this.familia.familia_id;
            let filtro          = [];
            this.articulos.map((art) => {
                if( art.articulos_familia_id == str ){
                    filtro.push( art );
                }
            });
            this.articulosPorFamilia = filtro;
            this.articulosPorFamiliaTemp = filtro;
            if( this.articulosPorFamilia.length == 0 ){
                this.msnError           = 'ARTÍCULOS NO ENCONTRADOS';
                this.isVisibleFamilia   = false;
            }else{
                this.msnError           = '';
                this.isVisibleFamilia   = true;
            }
        },
        showBox(){
            if( this.isVisibleProducto ){
                this.iSelect = '<i class="fas fa-angle-down"></i>';
            }else{
                this.iSelect    = '<i class="fas fa-angle-up"></i>'; 
                this.articulo   = '';
            }
            this.isVisibleProducto = !this.isVisibleProducto;
        },
        selectCliente(value){
            this.clientesTemps          = this.getClientes;
            this.clienteSelected        = value;
            this.clienteTxt             = value.CLIENTE.razon;
            this.clienteInputDisabled   = true;
            this.isVisibleClientes      = false;
            this.btnAgregarProducto.disabled = false;
            this.$store.commit('st/setCliente', {clienteId: value.CLIENTE.clientes_id, clienteNmb: value.CLIENTE.razon });
        },
        validarNoFrecuente(){
            if( this.clienteTxt.trim().length > 0 ){
                this.clienteTxt = this.clienteTxt.toUpperCase();
                this.$store.commit('st/setCliente', {clienteId: 0, clienteNmb: this.clienteTxt });
                this.btnAgregarProductoLoad(false, false);
            }else{
                this.btnAgregarProductoLoad(false, false);
            }
        },
        selectArticulo(value){
            this.articulo   = value;
            this.$nextTick(() => this.$refs.cInputInsert.focus());
            this.resetBuscarPor();
        },
        filterSearch(){
            this.articulosTemp  = this.articulos;
            const str           = this.search.toUpperCase();
            let filtro          = [];
            this.articulosTemp.map((art) => {
                if( art.articulos_descripcion.includes(str) ){
                    filtro.push( art );
                }
            });
            this.articulosTemp = filtro;
        },
        filterSearch2(){
            this.articulosPorFamiliaTemp  = this.articulosPorFamilia;
            const str           = this.search.toUpperCase();
            let filtro          = [];
            this.articulosPorFamiliaTemp.map((art) => {
                if( art.articulos_descripcion.includes(str) ){
                    filtro.push( art );
                }
            });
            this.articulosPorFamiliaTemp = filtro;
        },
        filterSearch3(cod){
            let result = '';
            this.articulos.map((art) => {
                if( art.articulos_codigobarra === cod ){
                    result = art;
                }
            });
            if( result == '' ){
                this.swalErrorText('LECTOR CÓDIGO DE BARRAS', `CÓDIGO ${cod} NO EXISTENTE`);
            }else{
                this.selectArticulo(result);
            }
        },
        filterSearch4(id){
            this.articulos.map((art) => {
                if( art.articulos_id === id ){
                    art.cantidad = '';
                    art.total    = '';
                }
            });
        },
        limpiarCliente(){
            this.clienteSelected        = '';
            this.clienteTxt             = '';
            this.clienteInputDisabled   = false;
            this.isVisibleClientes      = true;
            this.$store.commit('st/setCliente', {});
        },
        limpiarPedido(){
            const title         = "¿ESTÁS SEGURO?";
            const txtText       = 'SE ELIMINARÁ EL PEDIDO';
            const buttonText    = 'SI, ELIMINAR PEDIDO';
            const buttonColor   = "#d9534f";
            const accion        = 2;

            this.swalLoading(title, txtText, buttonText, buttonColor, accion);
        },
        realizarPedido(){
            const title         = "¿ESTÁS SEGURO?";
            const txtText       = 'SE REALIZARÁ EL PEDIDO';
            const buttonText    = 'SI, REALIZAR PEDIDO';
            const buttonColor   = "#198754";
            const accion        = 1;

            this.swalLoading(title, txtText, buttonText, buttonColor, accion);
        },
        async procesarPedido(){
            Swal.showLoading();
            const titleAccion   = 'PEDIDO';

            try{
                const res = await fetch(urlApi('pedido'), {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            pedido: this.pedido, 
                            clienteId: this.getCliente.clienteId, 
                            clienteNmb: this.getCliente.clienteNmb, 
                            total: this.pedidoTotal, 
                            vendedor: this.getVendedor.id
                        }
                    )
                });

                const content = await res.json();

                if( content.error ){
                    this.swalErrorText(titleAccion, content.info);
                }else{
                    this.swalSuccess(titleAccion, content.info);
                    this.pedido         = [];
                    this.pedidoTotal    = ''
                    this.cliente        = '';
                    this.$store.commit('st/setCliente', {});
                    this.$router.push({ name: 'home' });
                }                

            }catch{
                this.swalLog(titleAccion);
                console.log('ERROR procesarPedido')
            }
        },
        goHome(){
            if( this.pedido.length == 0 ){
                this.$router.push({ name: 'home' });
            }else{
                const title         = "¿ESTÁS SEGURO?";
                const txtText       = 'TIENES UN PEDIDO PENDIENTE, LO DESEAS CANCELAR';
                const buttonText    = 'SI, IR A LA PORTADA';
                const buttonColor   = "#198754";
                const accion        = 4;

                this.swalLoading(title, txtText, buttonText, buttonColor, accion);
            }
        },
        procesarHome(){
            this.$router.push({ name: 'home' });            
        },
        txtBtnLoad(){
            return '<i class="fas fa-sync-alt fa-spin"></i> PROCESANSO...';
        },
        btnLoginLoad(load, dis){
            this.btnLogin.txt = load ? this.txtBtnLoad() : '<i class="fas fa-sync-alt"></i> INGRESAR'
            this.btnLogin.disabled = dis;
        },
        btnAgregarLoad(load, dis){
            this.btnAgregar.txt = load ? this.txtBtnLoad() : 'AGREGAR'
            this.btnAgregar.disabled = dis;
        },
        btEditarLoad(load, dis){
            this.btnEditar.txt = load ? this.txtBtnLoad() : 'EDITAR'
            this.btnEditar.disabled = dis;
        },
        btnPedidoLoad(load, dis){
            this.btnPedido.txt = load ? this.txtBtnLoad() : 'REALIZAR PEDIDO'
            this.btnPedido.disabled = dis;
        },
        btnAgregarProductoLoad(load, dis){
            this.btnAgregarProducto.txt = load ? this.txtBtnLoad() : 'AGREGAR PRODUCTO'
            this.btnAgregarProducto.disabled = dis;
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
                            self.pedidoTotal    = '';
                            if( self.getTipoCliente != 'nuevo-cliente' ){
                                self.cliente = '';
                                self.limpiarCliente();
                            }
                            if( self.getTipoCliente == 'cliente-no-frecuente' ){
                                console.log('pasa...');
                                self.btnAgregarProducto.disabled = true;
                            }
                            
                            Swal.fire( 'PEDIDO ELIMINADO', 'PEDIDO ELIMINADO CON ÉXITO', 'success');
                            self.instanciar();
                            break;
                        case 3:
                            self.deleteProcess();
                            Swal.fire( 'ARTÍCULO ELIMINADO', 'ARTÍCULO ELIMINADO CON ÉXITO', 'success');
                            break;
                        case 4:
                            self.procesarHome();
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
.box-search{
    width: 100%;
    height: auto;
    border: 1px solid #dce0e4;
    border-top: 0;
    margin: -15px 0 0;
    padding: 20px 0;
}
.input-group-text {
    background-color: #fff !important;
}
.form-search{
    margin: 0 auto;
    width: 90%;
}
.box-list{
    max-height: 400px;
    margin: 0 auto;
    width: 95%;
    overflow: auto;
}
.btn-grid{
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	align-content: center;    
}
.box-list .list-group small{
    /* color: red; */
}
.box-list .list-group .list-group-item{
    background-color:gainsboro;
}

</style>