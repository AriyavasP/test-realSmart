<style lang="scss">
@import '../assets/global.scss';
</style>

<template>
    <div v-if="displayReset" class="body">
        <div class="container">
            <div class="login-box">
                <h1>Reset Password</h1>
                <form @submit.prevent="handleSubmit">
                    <div class="saction">
                        <input v-model="formData.username" type="email" placeholder="Username" required disabled>
                        <input v-model="formData.password" type="password" placeholder="Password" required
                            minlength="6">
                        <input v-model="formData.confirmPassword" type="password" placeholder="Confirm Password"
                            required minlength="6">
                    </div>
                    <button type="submit">CONFIRM</button>
                </form>
                <div v-if="successMessage" class="success">{{ successMessage }}</div>
            </div>
        </div>
    </div>
    <div v-else>
        <DialogReset />
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import apiService from '../fetchAPI/serviceUser';
import { useRouter, useRoute } from 'vue-router';
import DialogReset from './dialogReset.vue'

export default {
    components: {
        DialogReset
    },
    data() {
        return {
            formData: {
                password: '',
                confirmPassword: '',
                username: '',
            },
            error: null,
            successMessage: '',
            inputError: '',
            token: '',
            username: '',
            displayReset: true,
        };
    },
    methods: {
        validateInput() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phonePattern = /^\d{10}$/;
            if (emailPattern.test(this.formData.username) || phonePattern.test(this.formData.username)) {
                this.inputError = '';
            } else {
                this.inputError = 'Please enter a valid email or phone number.';
            }
        },
        async handleSubmit() {
            try {
                const response = await apiService.updatePassword(this.formData);

                if (response.data?.respone.status == 400) {
                    this.successMessage = 'can not reset password';
                } else if (response.data?.respone.status == 200) {
                    this.$router.push('/login');
                } else {
                    this.successMessage = 'Internal Server!';
                }
                this.error = null;
            } catch (err: any) {
                this.error = err.response ? err.response.data : err;
                this.successMessage = '';
            }
        },
        async decodeToken() {
            try {
                const route = useRoute();
                const token = route.params.token as string;
                const response = await apiService.getProfile(token);

                if (response.data?.respone.status == 400) {
                    this.displayReset = false;
                } else if (response.data?.respone.status == 200) {
                    this.formData.username = response.data?.respone.message.username
                    this.displayReset = true;
                } else {
                    this.displayReset = false;
                    this.successMessage = 'Internal Server!';
                }
            } catch (error) {
                this.$router.push('/login');
            }
        }
    },
    async mounted() {
        await this.decodeToken();
    }
};
</script>