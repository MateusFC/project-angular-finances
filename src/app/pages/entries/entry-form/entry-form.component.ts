import { AfterContentChecked, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Entry } from "../shared/entry.model";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import toastr from "toastr";
import { EntriesService } from "../shared/entry.service";
@Component({
  selector: "app-entry-form",
  templateUrl: "./entry-form.component.html",
  styleUrls: ["./entry-form.component.css"],
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();

  constructor(
    private entriesService: EntriesService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == "new") {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  private buildCategoryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadCategory() {
    if (this.currentAction == "edit") {
      this.route.paramMap
        .pipe(
          switchMap((params) =>
            this.entriesService.getByIdEntries(+params.get("id"))
          )
        )
        .subscribe(
          (entry) => {
            this.entry = entry;
            this.entryForm.patchValue(entry);
          },
          (error) => alert("Ocorreu um erro no servidor, tente mais tarde.")
        );
    }
  }

  private setPageTitle() {
    if (this.currentAction == "new") {
      this.pageTitle = "Cadastro de Nova Lançamento";
    } else {
      const entryName = this.entry.name || "";
      this.pageTitle = "Editando Lançamento: " + entryName;
    }
  }

  private createEntry() {
    const entry: Entry = Object.assign(
      new Entry(),
      this.entryForm.value
    );
    this.entriesService.createEntries(entry).subscribe(
      (entry) => this.actionsForSuccess(entry),
      (error) => this.actionsForError(error)
    );
  }

  private updateEntry() {
    const category: Entry = Object.assign(
      new Entry(),
      this.entryForm.value
    );

    this.entriesService.updateEntries(category.id, category).subscribe(
      (category) => this.actionsForSuccess(category),
      (error) => this.actionsForError(error)
    );
  }

  private actionsForSuccess(category: Entry) {
    toastr.success("Solicitação processada com sucesso!");
    this.router
      .navigateByUrl("categories", { skipLocationChange: true })
      .then(() => this.router.navigate(["categories", category.id, , "edit"]));
  }

  private actionsForError(error) {
    toastr.error("Ocorreu um erro ao processada sua solicitação!");
    this.submittingForm = false;
    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = [
        "Falha na comunicação com o servidor. Por favor, tente mais tarde",
      ];
    }
  }
}
