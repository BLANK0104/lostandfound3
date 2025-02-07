const cors = require('cors');

const corsOptions = {
    origin: 'http://192.168.107.140:5173',
    optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
