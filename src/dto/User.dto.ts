// This time, i'm using "Class" instead of interface.....Why? (Refer Vendor.dto.ts comments)
// Also, not using "constructor", so, we need to "disable" "strictPropertyInitialization" in `tsconfig.json` file (reason mentioned in that file itself)

import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserInputs {

    @IsEmail({}, { message: 'Invalid email address!' })
    email: string;

    @IsNotEmpty({ message: 'Phone number cannot be empty' })
    @Length(10, 10, { message: 'Invalid Phone Number!' })
    phone: string;

    @IsNotEmpty({ message: 'Password cannot be empty' })
    @Length(6, 12, { message: 'Password needs to be 6 to 12 characters long' })
    password: string;

}

export class UserLoginInputs {

    @IsEmail({}, { message: 'Invalid email address!' })
    email: string;
    
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @Length(6, 12, { message: 'Password needs to be 6 to 12 characters long' })
    password: string;
}

export class EditUserProfileInputs {

    @Length(3, 16, { message: 'firstName needs to be Atleast 3 characters Long' })
    firstName: string;

    @Length(3, 16, { message: 'lastName needs to be Atleast 3 characters Long' })
    lastName: string;

    address: string;
}

export interface UserPayload {
    _id: string;
    email: string;
    verified: boolean;
}

export class OrderInputs {
    _id: string;
    qty: number;
}