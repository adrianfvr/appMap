import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements AfterViewInit {
  private map!: L.Map;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    // Tiempo para que cargue el mapa
    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
  }

  async initMap(): Promise<void> {
    const position = await Geolocation.getCurrentPosition();
    const {latitude, longitude} = position.coords;
    console.log("current position", position);

    const customIcon = L.icon({
      iconUrl: './assets/icon/marker-map.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    this.map = L.map('mapID').setView([latitude, longitude], 18); // [Latitud, Longitud]

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    L.marker([latitude, longitude], { icon: customIcon })
      .addTo(this.map)
      .bindPopup("I'm here!!!")
      .openPopup();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
