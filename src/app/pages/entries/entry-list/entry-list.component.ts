import { Component, OnInit } from "@angular/core";

import { Entry } from "../shared/entry.model";
import { EntriesService } from "../shared/entry.service";
@Component({
  selector: "app-entry-list",
  templateUrl: "./entry-list.component.html",
  styleUrls: ["./entry-list.component.css"],
})
export class EntryListComponent implements OnInit {
  entries: Entry[] = [];
  constructor(private entriesService: EntriesService) {}

  ngOnInit() {
    this.entriesService.getAllEntries().subscribe(
      (entries) => (this.entries = entries),
      (error) => alert("error")
    );
  }

  deleteEntry(id: number) {
    const mustDelete = confirm("Deseja realmente excluir este item ?");
    if (mustDelete) {
      this.entriesService.deleteEntries(id).subscribe(
        () =>
          (this.entries = this.entries.filter(
            (element) => element.id !== id
          )),
        (error) => console.log("erro ao excluir")
      );
    }
  }
}
