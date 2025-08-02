<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold mb-6">Firestore Demo</h1>
    
    <!-- 添加书籍表单 -->
    <form @submit.prevent="addBook" class="mb-8">
      <div class="mb-4">
        <label for="isbn" class="block text-sm font-medium text-gray-700 mb-1">ISBN:</label>
        <input type="number" v-model.number="isbn" id="isbn" required 
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name:</label>
        <input type="text" v-model="name" id="name" required 
               class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      </div>
      <button type="submit" 
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
        Add Book
      </button>
    </form>
    
    <!-- 数据操作按钮 -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <button @click="queryByWhere" 
              class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
        Where Query
      </button>
      <button @click="queryByOrder" 
              class="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
        Order By
      </button>
      <button @click="queryByLimit" 
              class="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
        Limit Results
      </button>
      <button @click="deleteRandomDoc" 
              class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
        Delete Random Doc
      </button>
    </div>
    
    <!-- 结果展示 -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Books ({{ books.length }})</h2>
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p class="mt-2 text-gray-500">Loading...</p>
      </div>
      <div v-else-if="error" class="text-center py-8 text-red-500">
        {{ error }}
      </div>
      <div v-else-if="books.length === 0" class="text-center py-8 text-gray-500">
        No books found.
      </div>
      <ul v-else>
        <li v-for="book in books" :key="book.id" class="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-medium text-gray-900">{{ book.name }}</h3>
              <p class="text-sm text-gray-500">ISBN: {{ book.isbn }}</p>
            </div>
            <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">
              {{ book.id.substring(0, 8) }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { db } from '../firebase/init.js';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  deleteDoc,
  doc,
  getCountFromServer
} from 'firebase/firestore';

export default {
  setup() {
    const isbn = ref('');
    const name = ref('');
    const books = ref([]);
    const loading = ref(false);
    const error = ref(null);
    
    // 添加书籍
    const addBook = async () => {
      if (!isbn.value || !name.value) {
        alert('Please enter both ISBN and name');
        return;
      }
      
      loading.value = true;
      error.value = null;
      
      try {
        await addDoc(collection(db, 'books'), {
          isbn: Number(isbn.value),
          name: name.value
        });
        
        alert('Book added successfully!');
        isbn.value = '';
        name.value = '';
        fetchAllBooks(); // 添加后刷新列表
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };
    
    // 获取所有书籍
    const fetchAllBooks = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        books.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };
    
    // Where 查询示例：查找 ISBN 大于 2000 的书籍
    const queryByWhere = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const q = query(
          collection(db, 'books'), 
          where('isbn', '>', 2000)
        );
        
        const querySnapshot = await getDocs(q);
        books.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        alert(`Found ${books.value.length} books with ISBN > 2000`);
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };
    
    // OrderBy 示例：按 ISBN 升序排列
    const queryByOrder = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const q = query(
          collection(db, 'books'), 
          orderBy('isbn', 'asc')
        );
        
        const querySnapshot = await getDocs(q);
        books.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        alert(`Books sorted by ISBN ascending`);
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };
    
    // Limit 示例：只取前3条记录
    const queryByLimit = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const q = query(
          collection(db, 'books'), 
          limit(3)
        );
        
        const querySnapshot = await getDocs(q);
        books.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        alert(`Showing first ${books.value.length} books`);
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };
    
    // 删除示例：随机删除一条记录
    const deleteRandomDoc = async () => {
      if (!confirm('Are you sure you want to delete a random document?')) return;
      
      loading.value = true;
      error.value = null;
      
      try {
        // 先获取集合中的文档数量
        const countSnapshot = await getCountFromServer(collection(db, 'books'));
        const totalDocs = countSnapshot.data().count;
        
        if (totalDocs === 0) {
          alert('No documents to delete!');
          return;
        }
        
        // 随机选择一个文档
        const randomOffset = Math.floor(Math.random() * totalDocs);
        const q = query(collection(db, 'books'), limit(randomOffset + 1));
        const querySnapshot = await getDocs(q);
        
        // 获取最后一个文档（即随机选中的文档）
        const docs = querySnapshot.docs;
        const randomDoc = docs[docs.length - 1];
        
        // 删除文档
        await deleteDoc(doc(db, 'books', randomDoc.id));
        
        // 刷新列表
        fetchAllBooks();
        alert(`Deleted document with ID: ${randomDoc.id.substring(0, 8)}...`);
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };
    
    // 组件挂载时加载所有书籍
    fetchAllBooks();
    
    return {
      isbn,
      name,
      books,
      loading,
      error,
      addBook,
      queryByWhere,
      queryByOrder,
      queryByLimit,
      deleteRandomDoc
    };
  }
};
</script>