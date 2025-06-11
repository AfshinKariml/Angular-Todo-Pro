import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { CategoryModel } from '../../model/category.model';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  imports: [FormsModule, RouterModule],
})
export class CategoryComponent implements OnInit {
  categories: Array<CategoryModel> = [];
  categoryName: string = '';
  isAddOrEdit: boolean = true;
  categoryId: string = '';

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.fetchCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onSubmit(form: NgForm) {
    const newCategoryName = form.value.categoryName;
    if (this.isAddOrEdit) {
      this.categoryService.addCategory(newCategoryName);
    } else {
      this.categoryService.editCategory(this.categoryId, newCategoryName);
      this.isAddOrEdit = true;
    }
    form.reset();
    this.categoryId = '';
  }

  onDragStart(event: DragEvent, categoryId: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', categoryId);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const categoryId = event.dataTransfer.getData('text/plain');
      const category = this.categories.find(cat => cat.id === categoryId);

      if (category) {
        this.categoryId = categoryId;
        this.categoryName = category.categoryName;
        this.isAddOrEdit = false;
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDelete(categoryId: string) {
    this.categoryService.deleteCategory(categoryId);
  }
}