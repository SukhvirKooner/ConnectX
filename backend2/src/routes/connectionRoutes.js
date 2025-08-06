const express = require('express');
const {
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  removeConnection,
  listConnections,
  listSentRequests,
  listReceivedRequests,
  getConnectionSuggestions
} = require('../controllers/connectionController');
const { protect } = require('../middlewares/authMiddleware');
const { validate, connectionSchema, paginationSchema } = require('../middlewares/validationMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Connection listing routes
router.get('/', validate(paginationSchema), listConnections);
router.get('/requests/sent', validate(paginationSchema), listSentRequests);
router.get('/requests/received', validate(paginationSchema), listReceivedRequests);
router.get('/suggestions', validate(paginationSchema), getConnectionSuggestions);

// Connection request routes
router.post('/request', validate(connectionSchema.request), sendConnectionRequest);

// Connection action routes
router.put('/:id/accept', acceptConnectionRequest);
router.put('/:id/decline', declineConnectionRequest);
router.delete('/:id', removeConnection);

module.exports = router;