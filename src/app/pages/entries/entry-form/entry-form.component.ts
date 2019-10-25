import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

  public categories: Array<Category> = new Array<Category>();

  public imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  public ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(protected entryService: EntryService,
              protected categoryService: CategoryService,
              protected injector: Injector) {
    super(injector, new Entry(), entryService, Entry.fromJson);
  }

  ngOnInit(): void {
    this.loadCategories();
    super.ngOnInit();
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([key, value]) => {
        return {
          text: value,
          value: key
        };
      }
    );
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      description: [null],
      type: ['expense', Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
      date: [null, Validators.compose([Validators.required])],
      paid: [true, Validators.compose([Validators.required])],
      categoryId: [null, Validators.compose([Validators.required])],
    });
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  protected creationPageTitle(): string {
    return 'Cadastro de Novo Lançamento';
  }

  protected editionPageTitle(): string {
    const entryName = this.resource.name || '';
    return `Editando Categoria ${entryName}`;
  }

}
