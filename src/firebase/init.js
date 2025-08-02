// 导入 Firebase 核心功能
import { initializeApp } from "firebase/app";
// （可选）如果需要 Firestore，导入并初始化（根据需求添加）
import { getFirestore } from "firebase/firestore";

// Firebase 配置（从 main.js 迁移过来）
const firebaseConfig = {
  apiKey: "AIzaSyC8qmKxyIbLTtjUdzDIu1vjRvTYFswKWew",
  authDomain: "week7-haozhe.firebaseapp.com",
  projectId: "week7-haozhe",
  storageBucket: "week7-haozhe.firebasestorage.app",
  messagingSenderId: "896699367219",
  appId: "1:896699367219:web:750abc3adf11d5a2050846"
};

// 初始化 Firebase 应用
const firebaseApp = initializeApp(firebaseConfig);

// （可选）初始化 Firestore（如果需要使用数据库，取消注释以下代码）
const db = getFirestore(firebaseApp);

// 导出 Firebase 实例和 Firestore 实例（供其他组件导入使用）
export { firebaseApp, db };