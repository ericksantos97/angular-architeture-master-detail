import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  public entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.getAllEntries();
  }

  getAllEntries() {
    this.entryService.getAll().subscribe(
      entries => this.entries = entries,
      () => alert('Erro ao carregar a lista de lançamentos.')
    );
  }

  deleteEntry(entry: Entry) {
    const mustDelete = confirm('Deseja realmente excluir este item.');

    if (mustDelete) {
      this.entryService.delete(entry.id).subscribe(
        () => this.getAllEntries(),
        () => alert('Erro ao tentar excluir o lançamento.')
      );
    }
  }

}
