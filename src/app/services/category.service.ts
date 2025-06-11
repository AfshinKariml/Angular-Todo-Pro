import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CategoryModel } from '../model/category.model';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firestore: Firestore, private toaster: ToastrService) { }

  fetchCategories(): Observable<CategoryModel[]> {
    return collectionData(collection(this.firestore, 'categories'), { idField: 'id' }) as Observable<CategoryModel[]>;
  }

  addCategory(categoryName: string) {
    let newCategory: CategoryModel = {
      categoryName: categoryName,
      colorCode: this.colorGenerator(),
      todoCount: 0
    };
    addDoc(collection(this.firestore, 'categories'), newCategory).then(() => {
      this.toaster.success('دسته بندی جدید با موفقیت اضافه شد.');
    });
  }

  editCategory(categoryId: string, categoryName: string) {
    const categoryRef = doc(this.firestore, `categories/${categoryId}`);
    updateDoc(categoryRef, { categoryName: categoryName }).then(()=>{
      this.toaster.info('دسته بندی با موفقیت ادیت شد.')
    });
  }

  deleteCategory(categoryId: string) {
    return deleteDoc(doc(this.firestore, 'categories', categoryId)).then(() => {
      this.toaster.warning('دسته بندی مورد نظر حذف شد.')
    });
  }

  private colorGenerator(): string {
    const colorsArray = [
      '#e7845e', '#fc0184', '#f6b93f', '#9224a7', '#20c898',
      '#f03734', '#aad450', '#026467', '#fefefe', '#928779',
      '#D4D2A5', '#FCDEBE', '#90A583', '#B26E63', '#C6CAED'
    ];
    return colorsArray[Math.floor(Math.random() * colorsArray.length)];
  }
}
