import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price:{
        type: Number,
        required: [true, 'Subscription Price is required'],
        min: [0, 'Subscription Price must be greater than 0'],
    },
    currency :{
        type: Number,
        enum: ['USD', 'EUR', 'GBP', 'INR'],
        default: 'IND',
    },
    frequency:{
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category :{
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'other'],
        required: [true, 'Subscription Category is required'],
    },
    paymentMethod: {
        type: String,
        required: [true, 'Subscription Methods is required'],
        trim: true,
    },
    status:{
        type: String,
        enum : ['active', 'inactive', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'Subscription StartDate is required'],
        validate: {
            validator: (value) => value<= Date(),
            message: 'Subscription StartDate must be in past',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: (value) => value > this.startDate,
            message: 'Subscription Renewal must be after start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
},{timestamps:true});

subscriptionSchema.pre('save', function (next) {
    if (! this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 4,
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    if (this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
