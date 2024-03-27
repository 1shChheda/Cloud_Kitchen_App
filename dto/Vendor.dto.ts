// here, DTO for a vendor would be a simple TypeScript class that represents the data structure of a vendor. 
// It's used to transfer vendor-related information between different parts of your application.

/* Basic VendorDTO (using "Class") { used in previous projects } */
    // vendor.dto.ts

    // class VendorDTO {
    //     id: string;
    //     name: string;
    //     email: string;
    //     // Add more properties as needed
        
    //     constructor(id: string, name: string, email: string) {
    //         this.id = id;
    //         this.name = name;
    //         this.email = email;
    //         // Initialize other properties here
    //     }
    // }

    // export default VendorDTO;

/* then you'll create instances of this class: */
    // const vendor = new VendorDTO('1', 'Sample Vendor', 'vendor@example.com');

/* When to use "CLASS" */
    // when you need to create instances of objects with methods and properties. 
    // If you want to encapsulate behavior along with data, a class might be more suitable.

/* Use of "INTERFACE" */
/* When to use "INTERFACE" */
    // when you just need to define the shape of data without any implementation. 
    // If you're working with plain data structures or objects that don't require methods, interfaces are often preferred.
    
export interface CreateVendorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
};


export interface VendorLoginInput {
    email: string;
    password: string;
}

export interface VendorPayload {
    _id: string;
    email: string;
    name: string;
    foodTypes: [string];
}