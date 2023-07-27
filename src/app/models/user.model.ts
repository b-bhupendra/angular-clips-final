export default interface IUser{
    email: string,
    password? : string,
    age: string,
    name : string,
    phoneNumber : string
}

// export default class IUser{
//     email?: string;
//     password?: string;
//     age?: string;
//     name?: string;
//     phoneNumber?: string;
// }

// both can type check data 
// Classes are a feature of JS
// Interfaces are a feature of TS
// Interfaces do not get transpiled , while a class does
// methods can be added to a class