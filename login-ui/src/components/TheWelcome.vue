<template>
  <div class="container">
    <h1>Welcome</h1>
    <h4>List User</h4>
    <div v-if="users" class="user-list">
      <ul>
        <li v-for="user in users">
          <div> username: {{ user.username }} / email: {{ user.email }} </div>
        </li>
      </ul>
    </div>
    <div v-else class="loading">
      Loading users...
    </div>
    <div class="logout">
      <span v-if="error" class="error">{{ error }}</span>
      <button @click="signOut">Sign Out</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import apiService from '../fetchAPI/serviceUser';
import { useRouter } from 'vue-router';

interface User {
  _id: number;
  username: string;
  email: string;
}

export default defineComponent({
  name: 'YourComponent',
  data() {
    return {
      token: '',
      users: null as User[] | null,
      error: '',
    };
  },
  methods: {
    setLocalStorage() {
      this.token = localStorage.getItem('userToken') || '';
    },
    async handleSubmit() {
      try {
        apiService.setAuthToken(this.token);
        const response:any = await apiService.getUsers();

        if (response.data?.respone.status == 400) {
          this.error = 'you token is expired click here ->';
          console.error('Error: Bad request');
        } else if (response.data?.respone.status == 200) {
          this.users = response.data.respone.message;
          console.log('Success: Data fetched successfully');
        } else {
          console.log('Unexpected status code:', response.data?.respone.status);
        }
      } catch (err: any) {
        console.error('API call failed:', err);
      }
    },
    signOut() {
      localStorage.removeItem('userToken');
      this.$router.push('/login');
    }
  },
  async mounted() {
    this.setLocalStorage();
    await this.handleSubmit();
  }
});
</script>

<style lang="scss">
@import '../assets/home.scss'
</style>
