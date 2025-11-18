import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  displayedColumns = ['id', 'name', 'email', 'role', 'actions'];

  constructor(private http: HttpClient, private snack: MatSnackBar) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<any[]>('/api/users').subscribe(data => (this.users = data));
  }

  deleteUser(id: number) {
    this.http.delete(`/api/users/${id}`).subscribe(() => {
      this.snack.open('User deleted', 'OK', { duration: 1500 });
      this.load();
    });
  }
}
