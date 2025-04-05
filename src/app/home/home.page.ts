import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage implements AfterViewInit {
  private map!: L.Map;
  private points: { name: string; coords: [number, number] }[] = [];
  private routeInterval: any;
  private points1: { name: string; coords: [number, number] }[] = [
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
  private i = 0;
  // Icono mapa
  private customIconRed = L.icon({
    iconUrl: './assets/icon/marker-map.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
  private customIconGreen = L.icon({
    iconUrl: './assets/icon/marker-map-green.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
  // Punto por defecto (Estacion Bomberos Egipto)
  private defaultPosition: [number, number] = [
    4.592082775872901, -74.07004845194825,
  ];

  constructor(
    private _AlertController: AlertController,
    private _Storage: Storage
  ) {}

  async ngOnInit() {
    await this._Storage.create();

    const points = await this._Storage.get('points');
    this.points = points ? JSON.parse(points) : [];
  }

  ngAfterViewInit(): void {
    this.initMap();
    setTimeout(() => {
      this.map.invalidateSize();
      this.drawRoute();
      console.log(this.points);
    }, 500);
  }

  private async savePoint() {
    await this._Storage.set('points', JSON.stringify(this.points));
  }

  // Mostrar el alert
  async showErrorAlert(e: string) {
    const alert = await this._AlertController.create({
      header: 'Error',
      subHeader: 'Ubicación no encontrada',
      message: `Detalle: ${e}`,
      buttons: ['OK'], // Botón para cerrar el alert
    });

    await alert.present();
  }

  // Iniciar el Mapa
  async initMap(): Promise<void> {
    try {
      // Solicitar permisos de geolocalización
      const permission = await Geolocation.requestPermissions();
      console.log(permission);

      // Obtener la ubicación actual
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      this.map = L.map('mapID').setView([latitude, longitude], 18);

      L.marker([latitude, longitude], { icon: this.customIconRed })
        .addTo(this.map)
        .bindPopup("I'm here!!!")
        .openPopup();
    } catch (error: any) {
      await this.showErrorAlert(
        error.message || 'No se pudo establecer la ubicacion.'
      );

      this.map = L.map('mapID').setView(this.defaultPosition, 18);

      L.marker(this.defaultPosition, { icon: this.customIconRed })
        .addTo(this.map)
        .bindPopup('Bomberos Egipto')
        .openPopup();
    }
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  startRoute(): void {
    this.points.push({
      name: `Start Point`,
      coords: this.defaultPosition,
    });
    this.routeInterval = setInterval(async () => {
      try {
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = position.coords;

        this.points.push({
          name: `Point ${this.points.length + 1}`,
          coords: [latitude, longitude],
        });

        await this.savePoint();
        this.drawRoute();

        if (this.points.length >= 40) clearInterval(this.routeInterval);
      } catch (error: any) {
        this.points.push({
          name: `Point ${this.points.length + 1}`,
          coords: this.points1[this.i].coords,
        });
        this.i++;
        await this.savePoint();
        this.drawRoute();
        if (this.points.length == this.points1.length)
          clearInterval(this.routeInterval);
      }
    }, 5000);
  }

  drawRoute(): void {
    if (!this.map || this.points.length === 0) return;
    L.polyline(
      this.points.map((point) => point.coords as [number, number]),
      { color: 'blue' }
    )
      .addTo(this.map)
      .bringToFront();
    // Ajustar el mapa a los límites de la ruta
    this.map.fitBounds(
      this.points.map((point) => point.coords as [number, number])
    );
    this.points.forEach((point) => {
      L.marker(point.coords as [number, number], {
        icon: this.customIconGreen,
      })
        .addTo(this.map)
        .bindPopup(point.name)
        .openPopup();
    });
  }

  async setPoint(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      this.points.push({
        name: `Point ${this.points.length + 1}`,
        coords: [latitude, longitude],
      });

      await this.savePoint();
      this.drawRoute();
    } catch (error) {
      console.log('No se pudo colocar el punto.');
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
