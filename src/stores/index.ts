import { defineStore } from "pinia";

export const useMainStore = defineStore({
	id: "mainStore",
	state: () => ({
		user: [],
	}),

	actions: {
		getUser(userInfo: any) {
			this.user = userInfo
		}
	},
});
