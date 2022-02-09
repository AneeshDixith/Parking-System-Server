const express = require('express');
const BodyParser = require('body-parser');
const app = express();
const OwnerRoute = require('./Routes/Car_Owner');
const CarRoute = require('./Routes/Car');
const ParkRoute = require('./Routes/Park');
const getParkedRoute = require('./Routes/admin_view');

app.use(BodyParser.json());

app.use('/Owner', OwnerRoute);
app.use('/Car', CarRoute);
app.use('/Park', ParkRoute);
app.use('/admin', getParkedRoute);

app.listen(6060);