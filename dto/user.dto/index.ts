export type FetchUserDTO=  {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    pic: string,
}

export type CreateUserDTO = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
}