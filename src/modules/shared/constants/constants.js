

const URLBACK = (location.hostname === "localhost" || location.hostname === "127.0.0.1") 
                ? "http://localhost:8080/ingsite/api-pedidos/apirest/" 
                : "https://ingsite.cl/api/api-pedidos/apirest/";

const KEYSTORAGE = "pedidos-ingsite";
    
export default {
    URLBACK,
    KEYSTORAGE
}