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
    password: string;

}
