<template>
    <div>
      <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
    </div>
  </template>
  
  <script>
  import TodoItem from './TodoItem.vue';
  import axios from 'axios';
  
  export default {
    data() {
      return {
        todos: [],
      };
    },
    mounted() {
      this.fetchTodos();
    },
    methods: {
      async fetchTodos() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/todos', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            })
            .then(response => {
                this.todos = response.data.todos;
            })
            .catch(error => {
                console.error('Failed to fetch todos', error);
            });
            console.log(this.todos);
        } catch (error) {
          console.error('Failed to fetch todos', error);
        }
      },
    },
    components: {
      TodoItem,
    },
  };
  </script>
  