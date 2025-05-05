<template>
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">Todo List</h1>
          <button
            @click="logout"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div class="mb-6">
          <form @submit.prevent="addTodo" class="flex gap-2">
            <input
              v-model="newTodo"
              type="text"
              placeholder="Add a new todo"
              class="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              :disabled="loading"
            >
              Add
            </button>
          </form>
        </div>

        <div v-if="todos.length" class="bg-white rounded-lg shadow">
          <draggable
            v-model="todos"
            item-key="id"
            @end="reorderTodos"
            class="divide-y"
          >
            <template #item="{ element: todo }">
              <div
                class="flex items-center justify-between p-4 hover:bg-gray-50 cursor-move"
              >
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    :checked="todo.completed"
                    @change="toggleTodo(todo)"
                    class="h-5 w-5"
                  />
                  <span
                    :class="{ 'line-through text-gray-500': todo.completed }"
                    class="text-lg"
                  >
                    {{ todo.title }}
                  </span>
                </div>
                <button
                  @click="deleteTodo(todo.id)"
                  class="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </template>
          </draggable>
        </div>
        <p v-else class="text-center text-gray-500">No todos yet.</p>

        <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { VueDraggableNext } from 'vue-draggable-next';
  import api from '../api';
  
  export default {
    components: {
      draggable: VueDraggableNext,
    },
    setup() {
      const todos = ref([]);
      const newTodo = ref('');
      const loading = ref(false);
      const error = ref(null);
      const router = useRouter();

      const fetchTodos = async () => {
        try {
          const response = await api.get('/api/todos');
          todos.value = response.data.todos;
        } catch (err) {
          error.value = 'Failed to fetch todos';
        }
      };

      const addTodo = async () => {
        if (!newTodo.value.trim()) return;
        loading.value = true;
        try {
          const response = await api.post('/api/todos', {
            title: newTodo.value,
          });
          todos.value.push(response.data);
          newTodo.value = '';
        } catch (err) {
          error.value = 'Failed to add todo';
        } finally {
          loading.value = false;
        }
      };

      const toggleTodo = async (todo) => {
        try {
          const response = await api.put(`/api/todos/${todo.id}`, {
            completed: !todo.completed,
          });
          todo.completed = response.data.completed;
        } catch (err) {
          error.value = 'Failed to update todo';
        }
      };

      const deleteTodo = async (id) => {
        try {
          await api.delete(`/api/todos/${id}`);
          todos.value = todos.value.filter((todo) => todo.id !== id);
        } catch (err) {
          error.value = 'Failed to delete todo';
        }
      };

      const reorderTodos = async () => {
        try {
          const order = todos.value.map((todo) => todo.id);
          await api.put('/api/todos/reorder', { order });
        } catch (err) {
          error.value = 'Failed to reorder todos';
          fetchTodos();
        }
      };

      const logout = async () => {
        try {
          await api.post('/api/auth/logout');
        } catch (err) {
          console.error('Logout failed', err);
        } finally {
          localStorage.removeItem('token');
          router.push('/login');
        }
      };

      fetchTodos();
  
      return {
        todos,
        newTodo,
        loading,
        error,
        addTodo,
        toggleTodo,
        deleteTodo,
        reorderTodos,
        logout,
      };
    },
  };
  </script>