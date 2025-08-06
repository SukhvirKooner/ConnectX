const Connection = require('../models/connectionModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const { successResponse, errorResponse, notFoundResponse, forbiddenResponse } = require('../utils/responseUtils');
const { paginate } = require('../utils/paginationUtils');

/**
 * @desc    Send a connection request
 * @route   POST /api/connections/request
 * @access  Private
 */
const sendConnectionRequest = asyncHandler(async (req, res) => {
  const { addressee_id, message } = req.body;
  const requester_id = req.user._id;

  // Check if addressee exists
  const addressee = await User.findById(addressee_id);
  if (!addressee) {
    return notFoundResponse(res, 'User not found');
  }

  // Check if trying to connect with self
  if (addressee_id === requester_id.toString()) {
    return errorResponse(res, 400, 'Cannot send connection request to yourself');
  }

  // Check if connection already exists
  const existingConnection = await Connection.findOne({
    $or: [
      { requester_id, addressee_id },
      { requester_id: addressee_id, addressee_id: requester_id }
    ]
  });

  if (existingConnection) {
    return errorResponse(res, 400, `Connection already ${existingConnection.status}`);
  }

  // Create connection request
  const connection = await Connection.create({
    requester_id,
    addressee_id,
    message,
    status: 'pending'
  });

  // Create notification for the addressee
  await Notification.create({
    recipient_id: addressee_id,
    sender_id: requester_id,
    type: 'connection_request',
    content: `${req.user.name} sent you a connection request`,
    reference_id: connection._id,
    reference_model: 'Connection'
  });

  return successResponse(res, 201, 'Connection request sent successfully', connection);
});

/**
 * @desc    Accept a connection request
 * @route   PUT /api/connections/:id/accept
 * @access  Private
 */
const acceptConnectionRequest = asyncHandler(async (req, res) => {
  const connectionId = req.params.id;
  const userId = req.user._id;

  // Find connection by ID
  const connection = await Connection.findById(connectionId);

  if (!connection) {
    return notFoundResponse(res, 'Connection request not found');
  }

  // Check if user is the addressee
  if (connection.addressee_id.toString() !== userId.toString()) {
    return forbiddenResponse(res, 'Not authorized to accept this connection request');
  }

  // Check if connection is pending
  if (connection.status !== 'pending') {
    return errorResponse(res, 400, `Connection already ${connection.status}`);
  }

  // Update connection status
  connection.status = 'accepted';
  await connection.save();

  // Create notification for the requester
  await Notification.create({
    recipient_id: connection.requester_id,
    sender_id: userId,
    type: 'connection_accepted',
    content: `${req.user.name} accepted your connection request`,
    reference_id: connection._id,
    reference_model: 'Connection'
  });

  return successResponse(res, 200, 'Connection request accepted', connection);
});

/**
 * @desc    Decline a connection request
 * @route   PUT /api/connections/:id/decline
 * @access  Private
 */
const declineConnectionRequest = asyncHandler(async (req, res) => {
  const connectionId = req.params.id;
  const userId = req.user._id;

  // Find connection by ID
  const connection = await Connection.findById(connectionId);

  if (!connection) {
    return notFoundResponse(res, 'Connection request not found');
  }

  // Check if user is the addressee
  if (connection.addressee_id.toString() !== userId.toString()) {
    return forbiddenResponse(res, 'Not authorized to decline this connection request');
  }

  // Check if connection is pending
  if (connection.status !== 'pending') {
    return errorResponse(res, 400, `Connection already ${connection.status}`);
  }

  // Update connection status
  connection.status = 'declined';
  await connection.save();

  return successResponse(res, 200, 'Connection request declined', connection);
});

/**
 * @desc    Remove a connection
 * @route   DELETE /api/connections/:id
 * @access  Private
 */
const removeConnection = asyncHandler(async (req, res) => {
  const connectionId = req.params.id;
  const userId = req.user._id;

  // Find connection by ID
  const connection = await Connection.findById(connectionId);

  if (!connection) {
    return notFoundResponse(res, 'Connection not found');
  }

  // Check if user is part of the connection
  if (
    connection.requester_id.toString() !== userId.toString() &&
    connection.addressee_id.toString() !== userId.toString()
  ) {
    return forbiddenResponse(res, 'Not authorized to remove this connection');
  }

  // Delete connection
  await connection.remove();

  return successResponse(res, 200, 'Connection removed successfully');
});

/**
 * @desc    List user's connections
 * @route   GET /api/connections
 * @access  Private
 */
const listConnections = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  // Find all accepted connections where user is either requester or addressee
  const query = {
    $or: [
      { requester_id: userId, status: 'accepted' },
      { addressee_id: userId, status: 'accepted' }
    ]
  };

  // Get paginated results with populated user details
  const options = {
    populate: [
      { path: 'requester_id', select: 'name avatar_url title company' },
      { path: 'addressee_id', select: 'name avatar_url title company' }
    ],
    sort: { updatedAt: -1 }
  };

  const results = await paginate(Connection, query, page, limit, options);

  // Transform data to include connection user details
  const transformedData = results.data.map(connection => {
    const connectionUser = connection.requester_id._id.toString() === userId.toString() ?
      connection.addressee_id : connection.requester_id;
    
    return {
      _id: connection._id,
      user: connectionUser,
      status: connection.status,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt
    };
  });

  return successResponse(res, 200, 'Connections retrieved successfully', {
    data: transformedData,
    pagination: results.pagination
  });
});

/**
 * @desc    List outgoing connection requests
 * @route   GET /api/connections/requests/sent
 * @access  Private
 */
const listSentRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  // Find all pending connections where user is the requester
  const query = {
    requester_id: userId,
    status: 'pending'
  };

  // Get paginated results with populated addressee details
  const options = {
    populate: [
      { path: 'addressee_id', select: 'name avatar_url title company' }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(Connection, query, page, limit, options);

  return successResponse(res, 200, 'Sent connection requests retrieved successfully', results);
});

/**
 * @desc    List incoming connection requests
 * @route   GET /api/connections/requests/received
 * @access  Private
 */
const listReceivedRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  // Find all pending connections where user is the addressee
  const query = {
    addressee_id: userId,
    status: 'pending'
  };

  // Get paginated results with populated requester details
  const options = {
    populate: [
      { path: 'requester_id', select: 'name avatar_url title company' }
    ],
    sort: { createdAt: -1 }
  };

  const results = await paginate(Connection, query, page, limit, options);

  return successResponse(res, 200, 'Received connection requests retrieved successfully', results);
});

/**
 * @desc    Get connection suggestions
 * @route   GET /api/connections/suggestions
 * @access  Private
 */
const getConnectionSuggestions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  // Get current user's connections
  const connections = await Connection.find({
    $or: [
      { requester_id: userId },
      { addressee_id: userId }
    ]
  });

  // Extract connected user IDs
  const connectedUserIds = connections.map(conn => {
    return conn.requester_id.toString() === userId.toString() ?
      conn.addressee_id : conn.requester_id;
  });

  // Add current user ID to exclude from suggestions
  connectedUserIds.push(userId);

  // Find users who are not connected with current user
  const query = {
    _id: { $nin: connectedUserIds }
  };

  // Get current user for matching criteria
  const currentUser = await User.findById(userId);

  // Add company and location filters if available
  if (currentUser.company) {
    query.company = currentUser.company;
  }

  if (currentUser.location) {
    query.location = currentUser.location;
  }

  // Get paginated results
  const options = {
    select: 'name avatar_url title company location',
    sort: { name: 1 }
  };

  const results = await paginate(User, query, page, limit, options);

  return successResponse(res, 200, 'Connection suggestions retrieved successfully', results);
});

module.exports = {
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
  removeConnection,
  listConnections,
  listSentRequests,
  listReceivedRequests,
  getConnectionSuggestions
};