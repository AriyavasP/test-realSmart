<style lang="scss">
@import '../assets/global.scss';
</style>

<template>
    <div class="body">
        <div class="container">
            <div class="login-box">
                <h1>Reset Password</h1>
                <form @submit.prevent="handleSubmit">
                    <input v-model="formData.email" type="email" placeholder="Email" required>
                    <button type="submit">Sign In</button>
                </form>
                <div v-if="successMessage" class="success">{{ successMessage }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import apiService from '../fetchAPI/serviceUser';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

export default {
    data() {
        return {
            formData: {
                email: ''
            },
            error: null,
            successMessage: '',
            inputError: ''
        };
    },
    methods: {
        async handleSubmit() {
            try {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "success",
                    title: "Signed in successfully"
                });

                const response = await apiService.resetPassword(this.formData.email);

                if (response.data?.respone.status == 400) {
                    this.successMessage = 'can not send email';
                } else if (response.data?.respone.status == 200) {
                    this.successMessage = 'send mail successfully!';
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