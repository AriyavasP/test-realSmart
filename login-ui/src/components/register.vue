<style lang="scss">
@import '../assets/global.scss';
</style>

<template>
    <div class="body">
        <div class="container">
            <div class="login-box">
                <div class="register-header">
                    <a href="/login">Go Back</a>
                </div>
                <h1>Sign In</h1>
                <form @submit.prevent="handleSubmit">
                    <input v-model="formData.username" @input="validateInput" type="text"
                        placeholder="Email or phone number" required>
                    <div v-if="inputError" class="error">{{ inputError }}</div>
                    <input v-model="formData.email" type="email" placeholder="Email" required>
                    <input v-model="formData.password" type="password" placeholder="Password" required minlength="6">
                    <input v-model="formData.confirmPassword" type="password" placeholder="Confirm Password" required
                        minlength="6">
                    <button type="submit">Sign In</button>
                </form>
                <div v-if="successMessage" class="success">{{ successMessage }}</div>
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
                confirmPassword: '',
                email: ''
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
                const response = await apiService.createUser(this.formData);

                if (response.data?.respone.status == 400) {
                    this.successMessage = 'User cant created';
                } else if (response.data?.respone.status == 200) {
                    this.successMessage = 'User created successfully!';
                    setTimeout(() => {
                        this.$router.push('/login');
                    }, 1000);
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