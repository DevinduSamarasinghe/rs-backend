export type CreateUserDTO = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string,
}

export type SessionDTO = {
    sessionId: string,
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    role:string,
    valid: boolean
}

export type LoginDTO = {
    email: string,
    password: string
}

