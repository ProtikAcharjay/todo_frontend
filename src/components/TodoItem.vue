<template>
    <div>
      <span>{{ todo.title }}</span>
      <button @click="deleteTodo(todo.id)">Delete</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      todo: Object,
    },
    methods: {
      async deleteTodo(id) {
        try {
          await axios.delete(`/todos/${id}`);
          this.$emit('todoDeleted');
        } catch (error) {
          console.error('Failed to delete todo', error);
        }
      },
    },
  };
  </script>
  