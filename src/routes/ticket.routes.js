const express = require('express');
const router = express.Router();

const TicketController = require('../controllers/ticket.controller');
const { AuthTokenType } = require('../utils/token');
const { verifyAuth } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management operations
 */

/**
 * Create a new ticket.
 *
 * @function
 * @name createTicket
 * @memberof TicketController
 * @param {object} req - Express request object containing ticket details
 * @param {object} res - Express response object
 *
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     description: Allows the user to create a new ticket. Requires authentication.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the ticket
 *               description:
 *                 type: string
 *                 description: Detailed description of the issue
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.post('/tickets', verifyAuth(AuthTokenType.Access), TicketController.createTicket);

/**
 * Get all tickets.
 *
 * @function
 * @name getAllTickets
 * @memberof TicketController
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 *
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     description: Retrieves a list of all tickets. Requires authentication.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [open, closed, in-progress]
 *       401:
 *         description: Unauthorized
 */
router.get('/tickets', verifyAuth(AuthTokenType.Access), TicketController.getAllTickets);

/**
 * Get a specific ticket by ID.
 *
 * @function
 * @name getTicketById
 * @memberof TicketController
 * @param {object} req - Express request object with ticket ID in parameters
 * @param {object} res - Express response object
 *
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a specific ticket by ID
 *     description: Retrieves a specific ticket based on the provided ID. Requires authentication.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the ticket to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *       404:
 *         description: Ticket not found
 *       401:
 *         description: Unauthorized
 */
router.get('/tickets/:id', verifyAuth(AuthTokenType.Access), TicketController.getTicketById);

/**
 * Update the status of a ticket.
 *
 * @function
 * @name updateTicketStatus
 * @memberof TicketController
 * @param {object} req - Express request object with ticket ID in parameters and status in body
 * @param {object} res - Express response object
 *
 * @swagger
 * /tickets/{id}:
 *   patch:
 *     summary: Update the status of a ticket
 *     description: Updates the status of a ticket based on the provided ID. Requires authentication.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the ticket to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, closed, in-progress]
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
 *       404:
 *         description: Ticket not found
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.patch('/tickets/:id', verifyAuth(AuthTokenType.Access), TicketController.updateTicketStatus);

module.exports = { router };
