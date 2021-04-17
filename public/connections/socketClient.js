// Imports
import openSocket from 'socket.io-client';

// Server characteristics
const serverAdress = 'http://localhost:8000/';

// Establish connection
const connection = openSocket(serverAdress);

// Socket handshake handling
function subscribeToRatesUpdate(cb) {
   connection.on('data', (tradeRates) => cb(null, tradeRates));
   connection.emit('subscribeToRatesUpdate');
}

export { subscribeToRatesUpdate };
