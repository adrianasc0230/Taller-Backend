import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  imports: [],
  selector: 'app-admin-panel',
  styleUrl: './admin-panel.css',
  templateUrl: './admin-panel.html',
})
export class AdminPanel {
    constructor(private router:Router){}

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
