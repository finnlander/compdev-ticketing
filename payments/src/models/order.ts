import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from 'udemy-ticketing-common';

export { OrderStatus };
export { Order };

interface OrderAttrs {
    id: string;
    version: number;
    userId: string;
    status: OrderStatus;
    price: number;
}

export interface OrderDoc extends mongoose.Document {
    version: number;
    userId: string;
    price: number;
    status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {

    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    // rename 'id' -> '_id'
    const { ['id']: id, ...input } = { _id: attrs.id, ...attrs };
    return new Order(input);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);


