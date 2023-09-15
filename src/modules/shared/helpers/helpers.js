
import CONSTANTS from "../constants/constants";

export function urlApi(api) {
  return `${CONSTANTS.URLBACK}${api}`;
}

export function formatDinero(value) {
  let val = (value / 1).toFixed(0).replace('.', ',')
  let numeroFormateado = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `$${ numeroFormateado }`
}

export function fechaLatina(value) {
  const dia   = value.substring(8,10)
  const mes   = value.substring(5,7)
  const anno  = value.substring(0,4)
  const hora  = value.substring(11,19)
  const fecha = `${dia}/${mes}/${anno} ${hora}`;
  return fecha;
}

export function fechaLatinaSinHora(value) {
  const dia   = value.substring(8,10)
  const mes   = value.substring(5,7)
  const anno  = value.substring(0,4)
  const hora  = value.substring(11,19)
  const fecha = `${dia}/${mes}/${anno}`;
  return fecha;
}

export function dateIsValid(dateStr) {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;

  // if (dateStr.match(regex) === null) {
  //   return false;
  // }
  
  const [year, month, day] = dateStr.split('-');

  // 👇️ format Date string as `yyyy-mm-dd`
  const isoFormattedStr = `${year}-${month}-${day}`;

  const date = new Date(isoFormattedStr);

  const timestamp = date.getTime();

  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(isoFormattedStr);
}

export function cerrarSesion(){
  Swal.showLoading();
  localStorage.removeItem(CONSTANTS.KEYSTORAGE);
  this.$store.commit('st/setVendedor', {});
  this.$router.push({ name: 'login' });
  Swal.close();
}

export function setWithExpiry(value) {
  const now = new Date();
  const exp = 4;
  const timeExp = 60 * 60 * 1000 * exp;
  const item = {
      vendedor: value,
      expira: now.getTime() + timeExp,
  }
  localStorage.setItem(CONSTANTS.KEYSTORAGE, JSON.stringify(item))
}

export function getWithExpiry() {
  const itemStr = localStorage.getItem(CONSTANTS.KEYSTORAGE)
  
  if (!itemStr) {
      return null;
  }
  const item  = JSON.parse(itemStr);
  const now   = new Date();
  
  if ( now.getTime() > item.expira ) {
      localStorage.removeItem(CONSTANTS.KEYSTORAGE);
      return null;
  }
  return item;
}