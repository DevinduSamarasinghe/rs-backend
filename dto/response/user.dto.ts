export type FetchUserDTO=  {
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    password?: string,
    role: string,
    pic: string,
}

export type LoginResponseDTO = {
    sessionId: string,
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    valid: boolean
}

export type RegisterResponseDTO = {
    data: {
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        role: string,
        pic: string,
        _id: string,
        createdAt: Date,
        updatedAt: Date,
    }
}

export type SearchUserResponseDTO = {
    data: FetchUserDTO[]
}

export type CurrentUserDTO = {
    sessionId: string,
    _id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    valid: boolean,
    iat: number,
    exp: number
}

