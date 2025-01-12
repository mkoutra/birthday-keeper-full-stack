export interface FriendResponse {
    id: string,
    firstname: string,
    lastname: string,
    nickname: string | null | undefined,
    dateOfBirth: string,
    daysUntilNextBirthday: string
}

export const friendsDemo: FriendResponse[] = [
    {
        "id": "8",
        "firstname": "Michalis",
        "lastname": "Papadopoulos",
        "nickname": "",
        "dateOfBirth": "1998-02-10",
        "daysUntilNextBirthday": "54"
    },
    {
        "id": "2",
        "firstname": "Alexis",
        "lastname": "Alexiou",
        "nickname": "alex",
        "dateOfBirth": "1991-06-19",
        "daysUntilNextBirthday": "100"
    }
]