import User from '../models/userModel.js';
import CustomError from '../utils/CustomError.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';
import transactionModel from '../models/transactionModel.js';

export const createUser = asyncHandler(async (req, res) => {
    const { username, password, role, balance, commissionPercentage } = req.body;
    console.log('req.body', req.body);
    if (!username || !password || !role) {
        throw new CustomError('All fields are required: username, password, role.', 200);
    }

    if (!['player', 'agent', 'admin'].includes(role)) {
        throw new CustomError('Invalid role specified.', 200);
    }

    const existingUser = await User.findOne({ username, role });
    console.log('existingUser', existingUser);
    if (existingUser) {
        throw new CustomError(`Username already exists for the role: ${role}.`, 200);
    }


    const newUser = await User.create({
        username,
        password,
        role,
        balance: balance || 0,
        commissionPercentage: role === 'agent' ? (commissionPercentage || 10) : undefined,
    });

    res.status(201).json({
        success: true,
        message: 'User created successfully.',
        user: newUser,
    });
});

export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new CustomError('Username and password are required.', 200);
    }

    const user = await User.findOne({ username });
    if (!user) {
        throw new CustomError('Invalid username or password.', 200);
    }

    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
        throw new CustomError('Invalid username or password.', 200);
    }

    const token = generateToken(user._id);

    res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
            id: user._id,
            username: user.username,
            role: user.role,
            balance: user.balance
        },
    });
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    });
});

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log('id', id);
    const user = await User.findById(id);
    if (!user) {
        throw new CustomError('User not found.', 404);
    }

    res.status(200).json({
        success: true,
        user,
    });
});

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { username, role, balance, commissionPercentage, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
        throw new CustomError('User not found.', 404);
    }

    if (username !== undefined) {
        user.username = username;
    }

    if (role !== undefined) {
        user.role = role
    }
    if (balance !== undefined) {
        // if (user.role !== 'player') {
        //     throw new CustomError('Balance can only be updated for players.', 200);
        // }
        user.balance = balance;
        await transactionModel.create({
            user: id,
            amount: balance,
            type: 'credit',
            description: `Balance added for user: ${user.name}`
        });
    }

    // if (commissionPercentage !== undefined) {
    //     if (user.role !== 'agent') {
    //         throw new CustomError('Commission percentage can only be updated for agents.', 400);
    //     }
    //     user.commissionPercentage = commissionPercentage;
    // }

    if (isActive !== undefined) {
        user.isActive = isActive;
    }

    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
        success: true,
        message: 'User updated successfully.',
        user,
    });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new CustomError('User not found.', 404);
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: 'User deleted successfully.',
    });
});
