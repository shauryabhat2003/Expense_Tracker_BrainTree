const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        amount: {
            type: Number,
            required: [true, 'Please add an amount'],
            min: [0, 'Amount cannot be negative'],
        },
        category: {
            type: String,
            enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'],
            default: 'Other',
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Expense', ExpenseSchema);
