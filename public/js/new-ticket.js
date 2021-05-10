// Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

const socket = io();

socket.on('connect', () => {

    btnCrear.disabled = false;

});

socket.on('disconnect', () => {

    btnCrear.disabled = false;
    
});

socket.on('last-ticket', (lastTicket) => {
    console.log('si');
    lblNuevoTicket.innerText = 'Ticket: ' + lastTicket;
});


btnCrear.addEventListener( 'click', () => {
    
    socket.emit( 'next-ticket', null, ( ticket ) => {
        console.log('From server', ticket );
        lblNuevoTicket.innerText = ticket;
    });

});