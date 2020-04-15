
export function getUserName(userState /* UserState */) {
    return userState.username;
}

export class UserState {
    constructor(username) {
        this.username = username;
    }
}
