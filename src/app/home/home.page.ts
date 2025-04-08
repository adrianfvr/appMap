// import { Component } from '@angular/core';
// import * as L from 'leaflet';
// import { Geolocation } from '@capacitor/geolocation';
// import { AlertController } from '@ionic/angular';
// import { Storage } from '@ionic/storage-angular';

// @Component({
//   selector: 'app-home',
//   templateUrl: 'home.page.html',
//   styleUrls: ['home.page.scss'],
//   standalone: false,
// })
// export class HomePage {
//   private map!: L.Map;
//   private points: { name: string; coords: [number, number] }[] = [];
//   private routeInterval: any;
//   private routeLayerGroup = L.layerGroup();
//   private currentLocationMarker!: L.Marker;
//   private isTracking = false;

//   private customIconRed = L.icon({
//     iconUrl: './assets/icon/marker-map.png',
//     iconSize: [40, 40],
//     iconAnchor: [20, 40],
//     popupAnchor: [0, -40],
//   });

//   private customIconGreen = L.icon({
//     iconUrl: './assets/icon/marker-map-green.png',
//     iconSize: [40, 40],
//     iconAnchor: [20, 40],
//     popupAnchor: [0, -40],
//   });

//   iconName: string = 'walk';

//   constructor(
//     private alertController: AlertController,
//     private storage: Storage
//   ) {
//     this.initStorage();
//   }

//   private async initStorage() {
//     await this.storage.create();
//   }

//   private async handleError(error: any, defaultMessage: string) {
//     const message = error?.message || defaultMessage;
//     const alert = await this.alertController.create({
//       header: 'Error',
//       subHeader: 'Ubicación no encontrada',
//       message: `Detalle: ${message}`,
//       buttons: ['OK'],
//     });

//     await alert.present();
//   }

//   async ionViewDidEnter() {
//     await this.loadPoints();
//     await this.initMap();
//     setTimeout(() => {
//       this.map.invalidateSize(); // Forzar recalculo
//       this.drawRoute();
//     }, 500);
//   }

//   private async loadPoints() {
//     const points = await this.storage.get('points');
//     this.points = points || [];
//   }

//   private async savePoints() {
//     await this.storage.set('points', this.points);
//   }

//   private async initMap(): Promise<void> {
//     try {
//       const permission = await Geolocation.requestPermissions();
//       console.log(permission);

//       const position = await Geolocation.getCurrentPosition();
//       const { latitude, longitude } = position.coords;

//       this.map = L.map('mapID').setView([latitude, longitude], 18);
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '&copy; OpenStreetMap contributors',
//       }).addTo(this.map);

//       this.currentLocationMarker = L.marker([latitude, longitude], {
//         icon: this.customIconRed,
//       })
//         .addTo(this.map)
//         .bindPopup("I'm here!!!")
//         .openPopup();
//     } catch (error: any) {
//       await this.handleError(error, 'No se pudo establecer la ubicación');
//     }
//   }

//   async toggleRoute(): Promise<void> {
//     if (!this.isTracking) {
//       if (await this.startRoute()) {
//         this.isTracking = true;
//         this.iconName = 'stop-circle';
//       }
//     } else {
//       this.stopRoute();
//     }
//   }

//   private stopRoute(): void {
//     this.iconName = 'walk';
//     this.isTracking = false;
//     clearInterval(this.routeInterval);
//   }

//   private async startRoute(): Promise<boolean> {
//     try {
//       this.routeInterval = setInterval(async () => {
//         try {
//           const position = await Geolocation.getCurrentPosition();
//           const { latitude, longitude } = position.coords;

//           this.points.push({
//             name: `Point ${this.points.length + 1}`,
//             coords: [latitude, longitude],
//           });

//           await this.savePoints();
//           this.drawRoute();

//           if (this.points.length >= 40) {
//             this.stopRoute();
//           }
//         } catch (error: any) {
//           await this.handleError(error, 'No se pudo obtener la ubicación');
//         }
//       }, 120000);

//       return true;
//     } catch (error: any) {
//       await this.handleError(error, 'No se pudo iniciar el seguimiento');
//       return false;
//     }
//   }

//   private drawRoute(): void {
//     if (!this.map || this.points.length === 0) return;

//     this.clearMapRoutes();

//     const polyline = L.polyline(
//       this.points.map((p) => p.coords),
//       { color: 'blue' }
//     );
//     this.routeLayerGroup.addLayer(polyline);

//     this.points.forEach((point) => {
//       const marker = L.marker(point.coords, {
//         icon: this.customIconGreen,
//       }).bindPopup(point.name);
//       this.routeLayerGroup.addLayer(marker);
//     });

//     this.routeLayerGroup.addTo(this.map);
//     this.map.fitBounds(this.points.map((p) => p.coords));
//   }

//   async setPoint(): Promise<void> {
//     try {
//       const position = await Geolocation.getCurrentPosition();
//       const { latitude, longitude } = position.coords;

//       this.points.push({
//         name: `Set point ${this.points.length + 1}`,
//         coords: [latitude, longitude],
//       });

//       await this.savePoints();
//       this.drawRoute();
//     } catch (error: any) {
//       await this.handleError(error, 'No se pudo establecer un punto');
//     }
//   }

//   async deleteRoute(): Promise<void> {
//     this.stopRoute();
//     this.points = [];
//     await this.savePoints();
//     this.clearMapRoutes();

//     try {
//       const position = await Geolocation.getCurrentPosition();
//       const { latitude, longitude } = position.coords;

//       this.map.setView([latitude, longitude], 18);

//       if (this.currentLocationMarker) {
//         this.map.removeLayer(this.currentLocationMarker);
//       }

//       this.currentLocationMarker = L.marker([latitude, longitude], {
//         icon: this.customIconRed,
//       })
//         .addTo(this.map)
//         .bindPopup("I'm here!!!")
//         .openPopup();
//     } catch (error: any) {
//       await this.handleError(error, 'No se pudo establecer la ubicación');
//     }
//   }

//   private clearMapRoutes(): void {
//     this.routeLayerGroup.clearLayers();
//   }

//   ngOnDestroy(): void {
//     if (this.map) {
//       this.map.remove();
//     }
//     clearInterval(this.routeInterval);
//   }
// }
import { Component } from '@angular/core';
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
export class HomePage {
  private map!: L.Map;
  private points: { name: string; coords: [number, number] }[] = [];
  private routeLayerGroup = L.layerGroup();
  private currentLocationMarker!: L.Marker;
  private isTracking = false;
  private watchId: string | null = null; // <-- Para almacenar el ID del watcher

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

  iconName: string = 'walk';

  constructor(
    private alertController: AlertController,
    private storage: Storage
  ) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
  }

  private async handleError(error: any, defaultMessage: string) {
    const message = error?.message || defaultMessage;
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: 'Ubicación no encontrada',
      message: `Detalle: ${message}`,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async ionViewDidEnter() {
    await this.loadPoints();
    await this.initMap();
    setTimeout(() => {
      this.map.invalidateSize();
      this.drawRoute();
    }, 500);
  }

  private async loadPoints() {
    const points = await this.storage.get('points');
    this.points = points || [];
  }

  private async savePoints() {
    await this.storage.set('points', this.points);
  }

  private async initMap(): Promise<void> {
    try {
      const permission = await Geolocation.requestPermissions();
      console.log(permission);

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      const { latitude, longitude } = position.coords;

      this.map = L.map('mapID').setView([latitude, longitude], 18);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(this.map);

      this.currentLocationMarker = L.marker([latitude, longitude], {
        icon: this.customIconRed,
      })
        .addTo(this.map)
        .bindPopup("I'm here!!!")
        .openPopup();
    } catch (error: any) {
      await this.handleError(error, 'No se pudo establecer la ubicación');
    }
  }

  async toggleRoute(): Promise<void> {
    if (!this.isTracking) {
      if (await this.startRoute()) {
        this.isTracking = true;
        this.iconName = 'stop-circle';
      }
    } else {
      this.stopRoute();
    }
  }

  private stopRoute(): void {
    this.iconName = 'walk';
    this.isTracking = false;

    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  private async startRoute(): Promise<boolean> {
    try {
      this.watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 10000 },
        async (position, error) => {
          if (error) {
            await this.handleError(error, 'No se pudo obtener la ubicación');
            return;
          }
          if (position) {
            const { latitude, longitude } = position.coords;

            this.points.push({
              name: `Point ${this.points.length + 1}`,
              coords: [latitude, longitude],
            });

            await this.savePoints();
            this.drawRoute();

            if (this.points.length >= 40) {
              this.stopRoute();
            }
          }
        }
      );

      return true;
    } catch (error: any) {
      await this.handleError(error, 'No se pudo iniciar el seguimiento');
      return false;
    }
  }

  private drawRoute(): void {
    if (!this.map || this.points.length === 0) return;

    this.clearMapRoutes();

    const polyline = L.polyline(
      this.points.map((p) => p.coords),
      { color: 'blue' }
    );
    this.routeLayerGroup.addLayer(polyline);

    this.points.forEach((point) => {
      const marker = L.marker(point.coords, {
        icon: this.customIconGreen,
      }).bindPopup(point.name);
      this.routeLayerGroup.addLayer(marker);
    });

    this.routeLayerGroup.addTo(this.map);
    this.map.fitBounds(this.points.map((p) => p.coords));
  }

  async setPoint(): Promise<void> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      const { latitude, longitude } = position.coords;

      this.points.push({
        name: `Set point ${this.points.length + 1}`,
        coords: [latitude, longitude],
      });

      await this.savePoints();
      this.drawRoute();
    } catch (error: any) {
      await this.handleError(error, 'No se pudo establecer un punto');
    }
  }

  async deleteRoute(): Promise<void> {
    this.stopRoute();
    this.points = [];
    await this.savePoints();
    this.clearMapRoutes();

    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      const { latitude, longitude } = position.coords;

      this.map.setView([latitude, longitude], 18);

      if (this.currentLocationMarker) {
        this.map.removeLayer(this.currentLocationMarker);
      }

      this.currentLocationMarker = L.marker([latitude, longitude], {
        icon: this.customIconRed,
      })
        .addTo(this.map)
        .bindPopup("I'm here!!!")
        .openPopup();
    } catch (error: any) {
      await this.handleError(error, 'No se pudo establecer la ubicación');
    }
  }

  private clearMapRoutes(): void {
    this.routeLayerGroup.clearLayers();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }
}
