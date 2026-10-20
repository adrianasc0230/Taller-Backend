import { Component, importProvidersFrom} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { CartService } from '../../services/cart-service';



@Component({
  imports: [RouterLink, FontAwesomeModule,],
  selector: 'app-nav',
  styleUrl: './nav.css',
  templateUrl: './nav.html',
})
export class Nav { 
  faMagnifyingGlass = faMagnifyingGlass; 
  
  constructor(public cartService: CartService) {}

}
