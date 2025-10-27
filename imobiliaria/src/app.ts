import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './app/templates/components/navbar/navbar';
import { Footer } from "./app/templates/components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterOutlet, Footer, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'imobiliaria_prime2';
}
