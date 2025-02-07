const express = require('express');
const corsConfig = require('./middleware/corsConfig');
const errorHandler = require('./middleware/errorHandler');
const lostItemsRoutes = require('./routes/lostItemsRoutes');
const foundItemsRoutes = require('./routes/foundItemsRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(corsConfig);
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/lost-items', lostItemsRoutes);
app.use('/found-items', foundItemsRoutes);
app.use('/generate-report', reportRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
