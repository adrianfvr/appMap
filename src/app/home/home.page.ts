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
    const puntos = [
      { name: 'Centro de Bogotá', coords: [4.710989, -74.07209] },
      { name: 'Chapinero', coords: [4.71585, -74.034686] },
      { name: 'Teusaquillo', coords: [4.658646, -74.060854] },
      { name: 'Kennedy', coords: [4.625461, -74.093309] },
      { name: 'Engativá', coords: [4.682765, -74.119824] },
      { name: 'Puente Aranda', coords: [4.64635, -74.059952] },
      { name: 'Suba', coords: [4.738958, -74.100161] },
      { name: 'La Candelaria', coords: [4.598272, -74.076375] },
      { name: 'Usaquén', coords: [4.760684, -74.044926] },
      { name: 'Antonio Nariño', coords: [4.635223, -74.081994] },
    ];

    const defaultPosition: [number, number] = [4.710989, -74.07209];

    const customIcon = L.icon({
      iconUrl: './assets/icon/marker-map.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

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

      L.marker([latitude, longitude], { icon: customIcon })
        .addTo(this.map)
        .bindPopup("I'm here!!!")
        .openPopup();
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);

      this.map = L.map('mapID').setView(defaultPosition, 18);

      L.marker(defaultPosition, { icon: customIcon })
        .addTo(this.map)
        .bindPopup('Ubicación predeterminada: Bogotá.')
        .openPopup();
    }
    const ruta = L.polyline(
      puntos.map((punto) => punto.coords as [number, number]),
      { color: 'blue' }
    ).addTo(this.map);
    this.map.fitBounds(ruta.getBounds());

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    puntos.forEach((punto) => {
      L.marker(punto.coords as [number, number], { icon: customIcon })
        .addTo(this.map)
        .bindPopup(punto.name)
        .openPopup();
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
