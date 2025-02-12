import { User } from "@prisma/client";

export interface UserResponse extends Omit<User, 'password'> {
    _count: {
        crimeReports: number;
        comments: number;
    }
}

export async function getUser(): Promise<UserResponse> {
    const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    return response.json();
}
