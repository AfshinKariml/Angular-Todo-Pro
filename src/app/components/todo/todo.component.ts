import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from './../../services/todo.service';
import { TodoModel } from '../../model/todo.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  standalone: true,
  imports: [FormsModule]
})
export class TodoComponent implements OnInit {
  categoryId: string = '';
  todos: TodoModel[] = [];
  isAddOrEdit: boolean = true;
  todoName: string = '';
  todoId: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private todoService: TodoService
  ) { }

  ngOnInit() {
    this.categoryId = this.activatedRoute.snapshot.params['id'];
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.fetchTodos(this.categoryId).subscribe({
      next: (todos) => {
        this.todos = todos;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const newTodoTitle = form.value.todoName.trim();

    if (this.isAddOrEdit) {
      this.todoService.createTodo(this.categoryId, newTodoTitle).then(() => {
        this.loadTodos();
      })
    } else {
      this.todoService.updateTodo(this.categoryId, this.todoId!, newTodoTitle).then(() => {

        this.isAddOrEdit = true;
        this.loadTodos();
      })
    }

    form.reset();
    this.todoName = '';
  }

  onDelete(todoId: string) {
    this.todoService.deleteTodo(todoId, this.categoryId).then(() => {
      this.loadTodos();
    })
  }

  onEdit(todoId: string, title: string) {
    this.todoId = todoId;
    this.isAddOrEdit = false;
    this.todoName = title;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleCompletion(todo: TodoModel) {
    const newCompletionStatus = !todo.isCompleted;
    this.todoService.toggleTodoCompletion(this.categoryId, todo.id!, newCompletionStatus).then(() => {
      todo.isCompleted = newCompletionStatus;
    })
  }
}