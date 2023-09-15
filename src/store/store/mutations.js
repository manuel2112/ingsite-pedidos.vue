
export const setVendedor = ( state, value ) => {
    state.vendedor.id       = value.usuario_id;
    state.vendedor.nombre   = value.usuario_nombre;
}

export const setClientes = ( state, value ) => {
    state.clientes = value;
}

export const setCliente = ( state, {clienteId, clienteNmb} ) => {
    state.cliente = {
        clienteId,
        clienteNmb
    };
}

export const setTipoCliente = ( state, value ) => {
    state.tipoCliente = value;
}