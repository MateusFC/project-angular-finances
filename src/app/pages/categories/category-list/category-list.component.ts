import { Component, OnInit } from "@angular/core";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";
@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.css"],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getAllCategory().subscribe(
      (categories) => (this.categories = categories),
      (error) => alert("error")
    );
  }

  deleteCatory(id: number) {
    const mustDelete = confirm("Deseja realmente excluir este item ?");
    if (mustDelete) {
      this.categoryService.deleteCategory(id).subscribe(
        () =>
          (this.categories = this.categories.filter(
            (element) => element.id !== id
          )),
        (error) => console.log("erro ao excluir")
      );
    }
  }
}
