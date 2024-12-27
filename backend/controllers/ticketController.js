import Ticket from '../models/TicketModel.js';
import Raffle from '../models/RaffleModel.js';
import User from '../models/userModel.js';
import CustomError from '../utils/CustomError.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import transactionModel from '../models/transactionModel.js';

export const purchaseTicket = asyncHandler(async (req, res) => {
    const { userId, raffleId, selectedNumbers, quantity } = req.body;

    const [user, raffle] = await Promise.all([
        User.findById(userId),
        Raffle.findById(raffleId),
    ]);

    if (!user) throw new CustomError('User not found', 404);
    if (!raffle) throw new CustomError('Raffle not found', 404);
    if (raffle.entrants >= raffle.totalEntriesAllowed) {
        return res.status(200).json({
            success: true,
            message: 'Raffle is full, no more entries allowed',
        });
    }
    if (user.balance < raffle.ticketPrice) {
        return res.status(200).json({
            success: true,
            message: 'Insufficient balance',
        });
    }

    const existingTicket = await Ticket.findOne({ user: userId, raffle: raffleId });

    if (existingTicket) {
        if (existingTicket.quantity >= 5) {
            return res.status(200).json({
                success: true,
                message: 'You can only buy a maximum of 5 tickets per raffle',
            });
        }

        await updateExistingTicket(existingTicket, user, raffle, quantity);
        return res.status(200).json({
            success: true,
            message: 'Ticket quantity updated successfully',
            ticket: existingTicket,
            newBalance: user.balance,
        });
    }

    const newTicket = await Ticket.create({
        user: userId,
        raffle: raffleId,
        selectedNumbers,
        quantity,
        price: raffle.ticketPrice,
    });

    await finalizeTransaction(user, raffle, quantity);

    res.status(201).json({
        success: true,
        message: 'Ticket purchased successfully',
        ticket: newTicket,
        newBalance: user.balance,
    });
});

const updateExistingTicket = async (ticket, user, raffle, quantity) => {
    ticket.quantity += quantity;
    user.balance -= raffle.ticketPrice * quantity;
    raffle.entrants += 1;

    await Promise.all([ticket.save(), user.save(), raffle.save()]);
    await createTransaction(user._id, raffle.ticketPrice, raffle.name);
};

const finalizeTransaction = async (user, raffle, quantity) => {
    user.balance -= raffle.ticketPrice * quantity;
    raffle.entrants += 1;

    await Promise.all([user.save(), raffle.save()]);
    await createTransaction(user._id, raffle.ticketPrice, raffle.name);
};

const createTransaction = async (userId, amount, raffleName) => {
    await transactionModel.create({
        user: userId,
        amount,
        type: 'debit',
        description: `Ticket purchase for raffle: ${raffleName}`,
    });
};

export const getTicketsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const tickets = await Ticket.find({ user: userId }).populate('raffle').populate('user');
    if (!tickets || tickets.length === 0) {
        throw new CustomError('No tickets found for this user', 404);
    }

    res.status(200).json({
        success: true,
        tickets
    });
});

export const getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find().populate('raffle').populate('user');
    if (!tickets || tickets.length === 0) {
        throw new CustomError('No tickets found', 404);
    }

    res.status(200).json({
        success: true,
        tickets
    });
});

export const getTicketById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id).populate('raffle').populate('user');
    if (!ticket) {
        throw new CustomError('Ticket not found', 404);
    }

    res.status(200).json({
        success: true,
        ticket
    });
});

export const deleteTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
        throw new CustomError('Ticket not found', 404);
    }

    await ticket.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Ticket deleted successfully'
    });
});
