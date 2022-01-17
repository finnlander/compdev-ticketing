/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
// Allow param reassign as mongoose uses '_id' field for the records and it is renamed into more clear 'id' field.
/**
 * A mongoose models for the user object.
 */
import mongoose from 'mongoose';
import Password from '../services/password';

interface UserAttrs {
    email: string;
    password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            requred: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                ret.id = ret._id;
                delete ret._id;
            },
            versionKey: false,
        },
    }
);

// eslint-disable-next-line @typescript-eslint/no-use-before-define
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

// not using arrow function in the next line required for binding the mongoose model properly with 'this' value.
// eslint-disable-next-line func-names
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashedPassword = await Password.toHash(this.get('password'));
        this.set('password', hashedPassword);
    }

    done();
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
