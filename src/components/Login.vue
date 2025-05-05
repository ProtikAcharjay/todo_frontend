<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Password</label>
            <input
              v-model="form.password"
              type="password"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <p class="mt-4 text-center">
          Don't have an account?
          <router-link to="/register" class="text-blue-500 hover:underline"
            >Register</router-link
          >
        </p>
        <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api';
  
  export default {
    data() {
      return {
        form: {
          email: '',
          password: '',
        },
        loading: false,
        error: null,
      };
    },
    methods: {
      async login() {
        this.loading = true;
        this.error = null;
        try {
          const response = await api.post('/api/auth/login', this.form);
          localStorage.setItem('token', response.data.token);
          this.$router.push('/home');
        } catch (error) {
          this.error = error.response?.data?.error || 'Login failed';
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>