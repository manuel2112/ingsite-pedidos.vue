<template>

    <div class="container mt-5">
        <div class="row d-flex justify-content-center">
            <div class="col-md-6">
                <div class="card px-5 py-5">
                    <div class="form-data">
                        <form @submit.prevent=" sendLogin ">
                            <div class="forms-inputs mb-4"> <span>USUARIO</span> 
                            <input 
                                autocomplete="off" 
                                type="text" 
                                class="form-control"
                                v-model.trim="login.user"
                                @input="validateLogin()">
                            </div>
                            <div class="forms-inputs mb-4"> <span>CONTRASEÑA</span> 
                            <input 
                                autocomplete="off" 
                                type="password" 
                                class="form-control"
                                v-model.trim="login.pass"
                                @input="validateLogin()">
                            </div>
                            <div class="mb-3"> 
                                <button 
                                    type="submit"
                                    class="btn btn-dark w-100" 
                                    v-html=" btnLogin.txt " 
                                    :disabled=" btnLogin.disabled ">
                                </button> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { mapActions } from "vuex";
import { urlApi, setWithExpiry, getWithExpiry } from "../../shared/helpers/helpers"

export default {
data(){
        return{
            login: {},
            valLocal: {},
            btnLogin: {
                txt: '<i class="fas fa-sync-alt"></i> INGRESAR',
                disabled: true
            },
        }
    },

    created(){
        this.instanciar();
    },

    methods: {
        urlApi,
        setWithExpiry,
        getWithExpiry,
        ...mapActions('st',['loginPostApi']),
        instanciar(){
            const existe = this.getWithExpiry();
            if(existe){
                this.$router.push({ name: 'home' });
            }
        },
        async sendLogin(){

            const data = this.login;
            this.loginPostApi(data);

        },
        validateLogin(){
            if( this.login.user && this.login.pass  ){
                this.btnLoginLoad(false, false);
            }else{
                this.btnLoginLoad(false, true);
            }
        },
        txtBtnLoad(){
            return '<i class="fas fa-sync-alt fa-spin"></i> PROCESANSO...';
        },
        btnLoginLoad(load, dis){
            this.btnLogin.txt = load ? this.txtBtnLoad() : '<i class="fas fa-sync-alt"></i> INGRESAR'
            this.btnLogin.disabled = dis;
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

<style>

</style>