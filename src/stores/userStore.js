import { defineStore } from "pinia";
import { watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Utils from "../config/utils";

import roleServices from "../services/roleServices";
import authServices from "../services/authServices";

export const userStore = defineStore("user", {
    state: () => ({
        user: null,
        roles: null,
        currentRoute: null
    }),
    actions: {
        async checkRole(roleName) {
            // If the roles are null because of a reload, then the roles need to be requeried from the database
            if (!this.roles) {
                await this.setupStore();
            }

            return this.roles
                ? this.roles.some(
                      (role) =>
                          role.name.toLowerCase() === roleName.toLowerCase()
                  )
                : false;
        },
        async isAdmin() {
            return await this.checkRole("admin");
        },
        async isFaculty() {
            return await this.checkRole("faculty");
        },
        async isAuthenticated() {
            if (!this.user) return false;
            try {
                const { data } = await authServices.validateToken(this.user);
                return data.isValid;
            } catch (error) {
                console.log("Token validation failed:", error);
                return false;
            }
        },
        setupRouteWatcher() {
            const route = useRoute();
            const router = useRouter();

            const validateAndRedirect = async () => {
                try {
                    const isValidToken = await authServices.validateToken(
                        this.user
                    );
                    if (isValidToken) {
                        console.log("Valid Token");
                        router.push({ path: route.fullPath });
                    } else {
                        console.log("Invalid Token");
                        router.push({ name: "/" });
                    }
                } catch {
                    console.error("Token validation error");
                    router.push({ name: "/" });
                }
            };

            watchEffect(async () => {
                this.user = Utils.getStore("user");
                this.roles = (
                    await roleServices.getRolesByEmail(this.user.email)
                ).data;

                const previousRoute = this.currentRoute;
                this.currentRoute = route.fullPath;

                if (
                    ["/login", "/"].includes(this.currentRoute) ||
                    ["/login", "/"].includes(previousRoute)
                ) {
                    await validateAndRedirect();
                }
            });
        },
        async setupStore() {
            const user = Utils.getStore("user");
            const roles = await roleServices.getRolesByEmail(this.user.email);
            this.$patch({ user, roles: roles.data });
        }
    },
    persist: true // Persist across page reloads to keep the number of network requests down
});
