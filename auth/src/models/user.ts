import mongoose from 'mongoose';
import { Password } from '../services/password';

interface UserAttrs {
    email: string;
    password: string
}

interface UserModel extends mongoose.Model<UserDoc> {

    build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        requred: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            ret.id = ret._id;
            delete ret._id;
        },
        versionKey: false
    }
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashedPassword = await Password.toHash(this.get('password'));
        this.set('password', hashedPassword);
    }

    done();
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
