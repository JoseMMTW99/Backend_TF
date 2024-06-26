console.log('Bienvenidos al chat de WebSocket');

const socket = io();

socket.emit('message', 'Esto es data en forma de string (mensaje del Cliente al Servidor)')

socket.on('socket_individual', data => {
    console.log(data);
})

socket.on('para_todos_menos_el_actual', data => {
    console.log(data);
})

socket.on('evento_para_todos', data => {
    console.log(data);
})


// Chat en vivo

const input = document.getElementById('message');
const messageList = document.getElementById('list-message');

input.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        socket.emit('mensaje_cliente', input.value)
        input.value = '';
    }
})

socket.on('messages_server', data => {
    console.log(data);
})