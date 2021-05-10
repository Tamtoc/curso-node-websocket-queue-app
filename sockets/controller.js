const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();

const socketController = (socket) => {

    // Cuándo un cliente se conecta
    socket.emit( 'last-ticket', ticketControl.last );
    socket.emit( 'actual-state', ticketControl.last4 );
    socket.emit( 'pending-tickets', ticketControl.tickets.length );

    socket.on('next-ticket', ( payload, callback ) => {
        
        const next = ticketControl.next();
        callback( next );

        // Notificar que hay un nuevo ticket de asignar
        socket.broadcast.emit( 'pending-tickets', ticketControl.tickets.length );

    });

    socket.on('attend-ticket', ({ desktop }, callback) => {

        if ( !desktop ) {
            return callback({
                ok: false,
                msg: 'The desktop is required'
            });
        }

        const ticket = ticketControl.attendTicket( desktop );
        
        // Notificar a todas las pantallas cambios en los ultimos4
        socket.broadcast.emit('actual-state', ticketControl.last4);
        socket.emit( 'pending-tickets', ticketControl.tickets.length );
        socket.broadcast.emit( 'pending-tickets', ticketControl.tickets.length );

        if ( !ticket ) {
            callback({
                ok: false,
                msg: 'There are not pending tickets'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }

    });

}



module.exports = {
    socketController
}

