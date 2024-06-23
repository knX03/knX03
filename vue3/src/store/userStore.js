import {defineStore} from 'pinia';

const useUserStore = defineStore("userInfo", {
    state: () => ({
        user_Email: null,
        user_Name: "",
    }),
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'login_store',
                storage: localStorage,
            },
        ],
    },
})

export default useUserStore