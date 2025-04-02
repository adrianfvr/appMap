import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

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

  initMap(): void {
    const customIcon = L.icon({
      iconUrl:
        './assets/icon/marker-map.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    this.map = L.map('mapID').setView(
      [4.606449, -74.08132],
      18
    ); // [Latitud, Longitud]

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    L.marker([4.606449, -74.08132], { icon: customIcon })
      .addTo(this.map)
      .bindPopup('ETITC')
      .openPopup();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
