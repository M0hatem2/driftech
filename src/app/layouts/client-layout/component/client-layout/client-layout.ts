import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Header } from "../../header/header";
import { Footer } from "../../footer/footer";

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './client-layout.html',
  styleUrl: './client-layout.scss',
})
export class ClientLayout {

}