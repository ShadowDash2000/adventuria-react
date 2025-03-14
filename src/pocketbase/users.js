import {create} from "zustand";

const collectionName = 'users';

export const useUsersStore = create((set, get) => ({
    pb: null,
    users: new Map(),

    setPocketBase: (pb) => set({pb: pb}),
    fetch: async () => {
        const users = await get().pb.collection(collectionName).getFullList({
            sort: '-points',
        });

        const usersMap = new Map();
        users.forEach((user) => usersMap.set(user.id, user));

        set({users: usersMap});
    },
    update: (user) => {
        const usersMap = new Map(get().users);
        usersMap.set(user.id, user);
        set({users: usersMap});
    },
    getById: (id) => get().users.get(id),
}))