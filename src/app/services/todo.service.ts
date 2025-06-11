import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, increment } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionData, docData } from 'rxfire/firestore';
import { TodoModel } from '../model/todo.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(private firestore: Firestore,private toaster:ToastrService) { }

  // ایجاد وظیفه جدید
  createTodo(categoryId: string, todoTitle: string) {
    const categoryTodosRef = collection(this.firestore, 'categories', categoryId, 'todos');

    const newTodo: Partial<TodoModel> = {
      title: todoTitle,
      isCompleted: false,
    };

    return addDoc(categoryTodosRef, newTodo).then(() => {
      const categoryDocRef = doc(this.firestore, 'categories', categoryId);
      return updateDoc(categoryDocRef, { todoCount: increment(1) });
    }).then(()=>{
      this.toaster.success('وظیفه جدید با موفقیت اضافه شد.')
    });
  }

  // دریافت لیست وظایف
  fetchTodos(categoryId: string): Observable<TodoModel[]> {
    const categoryTodosRef = collection(this.firestore, 'categories', categoryId, 'todos');
    return collectionData(categoryTodosRef, { idField: 'id' }) as Observable<TodoModel[]>;
  }

  // دریافت وظیفه بر اساس شناسه
  fetchTodoById(categoryId: string, todoId: string): Observable<TodoModel | undefined> {
    const todoDocRef = doc(this.firestore, `categories/${categoryId}/todos/${todoId}`);
    return docData(todoDocRef) as Observable<TodoModel | undefined>;
  }

  // ویرایش وظیفه
  updateTodo(categoryId: string, todoId: string, newTitle: string) {
    const todoDocRef = doc(this.firestore, `categories/${categoryId}/todos/${todoId}`);
    return updateDoc(todoDocRef, { title: newTitle }).then(()=>{
      this.toaster.info('وظیفه جدید با موفقیت ادیت شد.')
    });
  }

  // تغییر وضعیت تکمیل وظیفه
  toggleTodoCompletion(categoryId: string, todoId: string, isCompleted: boolean) {
    const todoDocRef = doc(this.firestore, `categories/${categoryId}/todos/${todoId}`);
    return updateDoc(todoDocRef, { isCompleted: isCompleted }).then(()=>{
     if(isCompleted){
      this.toaster.success('وظیفه مورد نظر تکمیل شد.')
     }
    });
  }

  // حذف وظیفه
  deleteTodo(todoId: string, categoryId: string) {
    const todoDocRef = doc(this.firestore, `categories/${categoryId}/todos/${todoId}`);
    const categoryDocRef = doc(this.firestore, 'categories', categoryId);

    return deleteDoc(todoDocRef).then(() => {
      return updateDoc(categoryDocRef, { todoCount: increment(-1) }).then(()=>{
        this.toaster.warning('وظیفه مدنظر با موفقیت حذف شد.')
      });
    });
  }
}