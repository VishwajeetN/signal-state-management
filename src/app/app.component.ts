import { Component, ElementRef, OnInit, effect, inject, viewChild } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TodosFilter, TodosStore } from './store/todos.store';
import { TodosListComponent } from './todos-list/todos-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, JsonPipe, TodosListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'angular-material-tailwind-boilerplate';
  store = inject(TodosStore);

  //// Signal based view child template query
  filter = viewChild.required<ElementRef<HTMLButtonElement>>('filter');

  constructor() {
    effect(() => {
      const filter = this.filter();
      filter.nativeElement.value = this.store.filter();
    });
  }

  ngOnInit(): void {
    this.loadTodos()
      .then(() => console.log('Todos Loaded!'));
  }

  async loadTodos() {
    await this.store.loadAll();
  }

  async onAddTodo(title: string) {
    await this.store.addTodo(title);
  }

  async onDeleteTodo(id: string, event: MouseEvent) {
    event.stopPropagation();
    await this.store.deleteTodo(id);
  }

  async onTodoToggled(id: string, completed: boolean) {
    await this.store.updateTodo(id, completed);
  }

  onFilterTodos(status: any) {
    const filterStatus = status as TodosFilter;
    this.store.updateFilter(filterStatus);
  }
}

