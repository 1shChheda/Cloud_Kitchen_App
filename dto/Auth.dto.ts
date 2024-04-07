import { VendorPayload } from "./Vendor.dto";
import { UserPayload } from "./User.dto";

export type AuthPayload = VendorPayload | UserPayload;
export type VendorAuthPayload = VendorPayload;
export type UserAuthPayload = UserPayload;