const db = require('../database/models/index');
const User = db.User;
const Ticket = db.Ticket;

class TicketController {
    /**
     * Create a new ticket and notify the user.
     *
     * @async
     * @function createTicket
     * @memberof TicketController
     * @param {object} req - Express request object containing the ticket title and description in the body.
     * @param {object} res - Express response object.
     * @returns {Promise<void>} - Responds with the created ticket or an error message.
     */
    static async createTicket(req, res) {
        const { title, description } = req.body;
        const { userId } = req.user;

        try {
            const newTicket = await Ticket.create({
                title,
                description,
                userId,
            });

            // Notify user of new ticket creation
            await NotificationService.createNotification({
                message: `Your ticket "${newTicket.title}" has been created.`,
                userId,
                ticketId: newTicket.id,
            });

            res.status(201).json({
                status: 'success',
                message: 'Ticket created successfully',
                data: newTicket,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to create ticket',
                error: error.message,
            });
        }
    }

    /**
     * Get all tickets.
     *
     * @async
     * @function getAllTickets
     * @memberof TicketController
     * @param {object} req - Express request object.
     * @param {object} res - Express response object.
     * @returns {Promise<void>} - Responds with a list of tickets or an error message.
     */
    static async getAllTickets(req, res) {
        try {
            const tickets = await Ticket.findAll({
                include: [{ model: User, as: 'user', attributes: ['id', 'firstname', 'lastname', 'email'] }],
            });

            res.status(200).json({
                status: 'success',
                data: tickets,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve tickets',
                error: error.message,
            });
        }
    }

    /**
     * Get a specific ticket by ID.
     *
     * @async
     * @function getTicketById
     * @memberof TicketController
     * @param {object} req - Express request object containing the ticket ID in the parameters.
     * @param {object} res - Express response object.
     * @returns {Promise<void>} - Responds with the ticket details or an error message.
     */
    static async getTicketById(req, res) {
        const { id } = req.params;

        try {
            const ticket = await Ticket.findByPk(id, {
                include: [{ model: User, as: 'user', attributes: ['id', 'firstname', 'lastname', 'email'] }],
            });

            if (!ticket) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ticket not found',
                });
            }

            res.status(200).json({
                status: 'success',
                data: ticket,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to retrieve ticket',
                error: error.message,
            });
        }
    }

    /**
     * Update the status of a ticket and notify the user.
     *
     * @async
     * @function updateTicketStatus
     * @memberof TicketController
     * @param {object} req - Express request object containing the ticket ID in the parameters and new status in the body.
     * @param {object} res - Express response object.
     * @returns {Promise<void>} - Responds with the updated ticket or an error message.
     */
    static async updateTicketStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;

        try {
            const ticket = await Ticket.findByPk(id);

            if (!ticket) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Ticket not found',
                });
            }

            ticket.status = status;
            await ticket.save();

            // Notify the user of status change
            await NotificationService.createNotification({
                message: `The status of your ticket "${ticket.title}" has been updated to ${status}.`,
                userId: ticket.userId,
                ticketId: ticket.id,
            });

            res.status(200).json({
                status: 'success',
                message: 'Ticket status updated successfully',
                data: ticket,
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to update ticket status',
                error: error.message,
            });
        }
    }
}

module.exports = TicketController;
