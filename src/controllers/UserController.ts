import { Request, Response, NextFunction } from "express";
import { plainToClass } from 'class-transformer'; // to help us convert the plain (literal) object to class (constructor) object
import { validate } from 'class-validator';
import { CreateUserInputs, EditUserProfileInputs, OrderInputs, UserLoginInputs } from "../dto";
import { EncryptedPassword, GenerateSalt, ValidatePassword, GenerateToken, SetTokenCookie, onRequestOTP, GenerateOtp, GenerateUserToken } from "../utility";
import { Food, Order, User } from "../models";

// Basic Signup/Login/Auth Workflow in my head:
// In user signup, I want it such that user is just able to create an account using email, phone number, and password. (not verified yet) (we may also send email to his email address, stating "thank you for registering with us" or something) (otp and expiryDateTime are null).
// As soon as the signup is successful, we send the response "Account created successfully. Please login to continue.", 
// User will be redirected to the login page, so that he can enter login credentials (email, password), if the credentials are correct (that is password is correct) then he is sent an OTP on the registered phone number. (so, we have to save the otp and expiryDateTime into the user's DB info accordingly). Also, when the login credentials are correct, the user is still "not verified", but we generate the token (saving user info _id, email, verified as Payload) and save the authToken into a cookie. [ Why? so we can identify the user correctly on the OTP Screen ]
// Then, on another controller, we verify the OTP, where we use the "req.user" (saved in cookie) to check if user.otp == enteredOtp.
// If he enters correct OTP, we update the token info "verified: true", and successfully be authenticated. also saving this updation into the cookie and user DB.
// To check for OTP expiry date check when verifying the OTP. if the expiry time has passed, then follow the following procedure:
// If he enters the wrong otp, or the otp expires, then we can give him another controller option to "RequestNewOtp", where we generate a new OTP, update it in DB, and all that blah..blah..blah process.
// Note: I want the authToken verification such that the user can access the dashboard and other user routes only if "verified = true" is mentioned in the authToken of cookie. if the verifies field is false, then the routes shouldn't be accessible, even if the token is present.
// Also, this "OTP verification" is a One-Time-Thing. 
// once "verified = true", We simply just authenticate using Login Page (email, password, NO OTP)

export const UserSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInputs = plainToClass(CreateUserInputs, req.body);

        const inputErrors = await validate(userInputs, { validationError: { target: true } });

        if (inputErrors.length > 0) {
            return res.status(400).json(inputErrors);
        }

        // now, if no validation error occurs, we proceed with our Signup
        const { email, phone, password } = userInputs;

        // THREE(3) scenarios:
        // 1) User Exists & isVerified -> We cannot create same user again
        const existingUser = await User.findOne({ email });
        if (existingUser?.verified) {
            return res.status(409).json({ message: "User already exists with this Email" });
        }

        const salt = await GenerateSalt();
        const userPassword = await EncryptedPassword(password, salt);

        // 2) User Exists & isNOTVerified -> We cannot create same user again BUT, we update any new info he tries to enter (He might want to change the phone number, or password...But since we're creating the user already, we simply need to update these new details into the UserDoc)
        if (existingUser?.verified === false) {
            await User.findOneAndUpdate({ email }, {
                password: userPassword,
                salt,
                phone,
            });

            return res.status(201).json({ message: "User Info Updated!. Please login to continue." });
        }

        // 3) User DoesNotExist & isCompletelyNew -> Create New User
        if (!existingUser) {
            const result = await User.create({
                email,
                password: userPassword,
                salt,
                phone,
                verified: false, // user is not verified
                firstName: '',
                lastName: '',
                address: '',
                lat: 0,
                lng: 0,
                orders: []
            });

            // extra feature: send email to the user for account creation confirmation

            return res.status(201).json({ message: "Account created successfully. Please login to continue." });
        }

    } catch (error) {
        console.error("Error user Signup:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const UserLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = <UserLoginInputs>req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(409).json({ message: "Login Credentials Invalid" });
        }

        // validate password
        const validation = await ValidatePassword(password, existingUser.password);
        if (validation) {

            const token = await GenerateUserToken({
                _id: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified
            });

            // Send JWT token in a HTTP-only cookie
            SetTokenCookie(res, token);

            // if the user has not verified his PhoneNo, then conduct the OTP verification thing (OTP Screen), else No Need! (direct Dashboard Screen)
            if (!existingUser.verified) {

                const { otp, expiryDateTime } = await GenerateOtp();

                await User.findOneAndUpdate({ email }, {
                    otp,
                    otp_expiry: expiryDateTime,
                    verified: existingUser.verified
                });

                // await onRequestOTP(otp, existingUser.phone); // for twilio SMS service

                let loginResponse = { message: "OTP Sent to registered Mobile Number!" }
                return res.status(200).json(loginResponse);

            } else {
                let loginResponse = { message: "Login Successful! Proceed to User Dashboard" }
                return res.status(200).json(loginResponse);
            }

        } else {
            return res.status(401).json({
                message:
                    "Invalid Password! Try Again"
            });
        }

    } catch (error) {
        console.error("Error user Login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const UserVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "Login Error. Try Login again" });
        }

        const existingUser = await User.findOne({ _id: user._id });

        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ message: "Please provide OTP" });
        }

        // check OTP validity (including expiry)
        if (existingUser) {

            const now = new Date();
            if (now > existingUser.otp_expiry) {
                return res.status(400).json({ message: "OTP Expired. Please request a new one." });
            }

            if (otp !== existingUser.otp) {
                return res.status(400).json({ message: "Incorrect OTP!" });
            }

            // update user to verified
            await User.findOneAndUpdate({ _id: user._id }, { verified: true });

            // set "verified: true"
            const token = await GenerateUserToken({
                _id: existingUser._id,
                email: existingUser.email,
                verified: true
            });

            SetTokenCookie(res, token);

            return res.status(200).json({ message: "User Verification successful!" });
        }
    } catch (error) {
        console.error("Error user Verification:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.error("Error user Requesting Otp:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const GetUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }
        
        const profile = await User.findById(user._id);
        if (!profile) {
            return res.status(404).json({ message: "User Information not found" });
        }

        return res.status(200).json({ profile });

    } catch (error) {
        console.error("Error getting user Profile:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const EditUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }

        const profileInputs = plainToClass(EditUserProfileInputs, req.body);
        const profileErrors = await validate(profileInputs, { validationError: { target: false } });

        if(profileErrors.length > 0) {
            return res.status(400).json(profileErrors);
        }

        const { firstName, lastName, address } = profileInputs;
        
        const profile = await User.findById(user._id);
        if (!profile) {
            return res.status(404).json({ message: "User Information not found" });
        }

        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.address = address;
        const result = await profile.save();

        return res.status(200).json({ message: "User Profile Updated Successfully!", result });

    } catch (error) {
        console.error("Error updating user Profile:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }

        const profile = await User.findById(user._id).populate("cart.food");
        let cartItems = Array();

        const { _id, qty } = <OrderInputs>req.body;

        const food = await Food.findById(_id);

        if (!food) {
            return res.status(400).json({ message: "Food Item does not Exist!" });
        }

        if (!profile) {
            return res.status(400).json({ message: "User Profile Not Found!" });
        }

        cartItems = profile.cart;
        if (cartItems.length > 0) { // update existing cart
            let existingFoodItem = cartItems.filter(item => item.food._id.toString() === _id);

            if (existingFoodItem.length > 0) {
                const index = cartItems.indexOf(existingFoodItem[0]);

                if (qty > 0) { // if we really want to add specific qty of foodItem
                    cartItems[index] = { food, qty }
                } else { // if we want to remove that items from the cart (pass "0" as qty)
                    cartItems.splice(index, 1);
                }

            } else {
                cartItems.push({ food, qty });
            }

        } else { // create new cart
            cartItems.push({ food, qty });
        }

        if (cartItems) {
            profile.cart = cartItems as any;
            const cartResult = await profile.save();

            return res.status(201).json(cartResult.cart);
        }

    } catch (error) {
        console.error("Error while adding to cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }
        
        const profile = await User.findById(user._id).populate('cart.food');

        let cartItems = Array();
        cartItems = profile.cart;

        if (!profile) {
            return res.status(400).json({ message: "User Profile Not Found" });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is Empty!" });
        }

        return res.status(200).json(profile.cart);

    } catch (error) {
        console.error("Error while getting to cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }

        const profile = await User.findById(user._id).populate('cart.food');
        
        let cartItems = Array();
        cartItems = profile.cart;

        if (!profile) {
            return res.status(400).json({ message: "User Profile Not Found" });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is Already Empty!" });
        }

        profile.cart = [] as any;
        const cartResult = await profile.save()
        return res.status(200).json(cartResult);

    } catch (error) {
        console.error("Error while deleting to cart:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }

        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

        const profile = await User.findById(user._id).populate("cart.food");

        if (!profile || !profile.cart.length) {
            return res.status(404).json({ message: "No Food Items Added to the Order!" });
        }

        let netAmount = 0.0;
        const cartItems = [];
        let vendorId;

        for (const cartItem of profile.cart) {
            const food = await Food.findById(cartItem.food._id);
            if (!food) {
                return res.status(404).json({ message: "Food Item not found!" });
            }
            vendorId = food.vendorId;
            netAmount += food.price * cartItem.qty;
            cartItems.push({ food: cartItem.food, qty: cartItem.qty });
        }

        const currentOrder = await Order.create({
            orderId: orderId,
            vendorId: vendorId, // Assuming all items are from the same vendor
            items: cartItems,
            totalAmount: netAmount,
            orderDate: new Date(),
            paymentOption: 'COD',
            paymentResponse: '',
            orderStatus: 'Waiting',
            remarks: '',
            deliveryId: '',
            appliedOffers: false,
            offerId: null,
            readyTime: 45,
        });

        if (!currentOrder) {
            return res.status(404).json({ message: "Order Not Placed. Please Try Again" });
        }

        profile.orders.push(currentOrder);

        // Clear the user's cart after placing the order
        profile.cart = [] as any;
        await profile.save();

        return res.status(201).json({ message: "Order Placed Successfully!", currentOrder });

    } catch (error) {
        console.error("Error creating Order:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }

        const profile = await User.findById(user._id).populate("orders");

        if (profile) {
            return res.status(200).json(profile.orders);
        }
    } catch (error) {
        console.error("Error getting user Orders:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }

        const orderId = req.params.id;

        if(orderId) {
            const order = await Order.findById(orderId).populate("items.food");
    
            if (order) {
                return res.status(200).json(order);
            }

        }

    } catch (error) {
        console.error("Error getting OrderById:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}