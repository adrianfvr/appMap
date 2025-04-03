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
    setTimeout(() => this.map.invalidateSize(), 500);
  }

  async initMap(): Promise<void> {
    const puntos: [number, number][] = [
      [4.710989, -74.07209], // Centro de Bogotá
      [4.71585, -74.034686], // Chapinero
      [4.658646, -74.060854], // Teusaquillo
      [4.625461, -74.093309], // Kennedy
      [4.682765, -74.119824], // Engativá
      [4.64635, -74.059952], // Puente Aranda
      [4.738958, -74.100161], // Suba
      [4.598272, -74.076375], // La Candelaria
      [4.760684, -74.044926], // Usaquén
      [4.635223, -74.081994], // Antonio Nariño
    ];
    const defaultPosition: [number, number] = [4.710989, -74.07209];
    try {
      // Solicitar permisos de geolocalización
      const permission = await Geolocation.requestPermissions();
      console.log('Permiso de geolocalización:', permission);

      // Obtener la ubicación actual
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });

      const { latitude, longitude } = position.coords;
      console.log('Current Position: ', position);
      this.map = L.map('mapID').setView([latitude, longitude], 18); // [Latitud, Longitud]

      const customIcon = L.icon({
        iconUrl: './assets/icon/marker-map.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
      L.marker([latitude, longitude], { icon: customIcon })
        .addTo(this.map)
        .bindPopup("I'm here!!!")
        .openPopup();
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);

      // Si hay un error, usar la ubicación predeterminada
      this.map = L.map('mapID').setView(defaultPosition, 18);

      const customIcon = L.icon({
        iconUrl: './assets/icon/marker-map.png',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      L.marker(defaultPosition, { icon: customIcon })
        .addTo(this.map)
        .bindPopup('Ubicación predeterminada: Bogotá.')
        .openPopup();
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    const ruta = L.polyline(puntos, { color: 'blue' }).addTo(this.map);
    this.map.fitBounds(ruta.getBounds());
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
