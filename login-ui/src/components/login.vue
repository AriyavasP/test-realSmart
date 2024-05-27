<style lang="scss">
@import '../assets/global.scss';
</style>

<template>
    <div class="body">
        <div class="container">
            <div class="login-box">
                <h1>Sign In</h1>
                <form @submit.prevent="handleSubmit">
                    <div class="saction">
                        <input v-model="formData.username" @input="validateInput" type="text"
                        placeholder="Email or phone number" required>
                        <div v-if="inputError" class="error">{{ inputError }}</div>
                    </div>
                    <div class="saction">
                        <input v-model="formData.password" type="password" placeholder="Password" required minlength="6"
                        maxlength="60">
                    </div>
                    <button type="submit">Sign In</button>
                </form>
                <div v-if="successMessage" class="success">{{ successMessage }}</div>
                <div class="footer-dialog">
                    <a href="/reset">forget password</a>&nbsp;/&nbsp;<a href="/register">Sign Up</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import apiService from '../fetchAPI/serviceUser';
import { useRouter } from 'vue-router';

export default {
    data() {
        return {
            formData: {
                username: '',
                password: '',
            },
            error: null,
            successMessage: '',
            inputError: ''
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
                const response = await apiService.login(this.formData);

                if (response.data?.respone.status == 400) {
                    this.successMessage = 'can not login';
                } else if (response.data?.respone.status == 200) {
                    if (response.data?.respone.message) {
                        localStorage.setItem('userToken', response.data?.respone.message);
                        apiService.setAuthToken(response.data?.respone.message);
                    }
                    this.$router.push('/');
                } else {
                    this.successMessage = 'Internal Server!';
                }
                this.error = null;
            } catch (err: any) {
                this.error = err.response ? err.response.data : err;
                this.successMessage = '';
            }
        }
    },
};
</script>