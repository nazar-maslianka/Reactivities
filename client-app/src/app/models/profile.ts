import { User } from "./user";

export interface Profile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?: Photo[];
}

export class Profile implements Profile {
    constructor (user: User) {
        this.image = user.image;
        this.username = user.username;
        this.displayName = user.displayName
    }
}


export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}