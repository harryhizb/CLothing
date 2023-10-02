import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    paymentIntentId: String,
    amount: Number,
    currency: String,
    paymentStatus: String,
},

{
    timestamps: true,
},

);

export default mongoose.model('payment', PaymentSchema);