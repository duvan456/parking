import { Component } from '@angular/core';
import { ApiConection } from "../Shared/ApiConection";
import { MenuItem } from "primeng/api";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from "primeng/inputtext";
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DropdownModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  formParqueadero: FormGroup;
  formVehiculo: FormGroup;
  formUsuario: FormGroup;
  formTarifa: FormGroup;
  items: MenuItem[] | undefined;
  parqueaderos: any[] = [];
  vehiculos: any[] = [];
  propietarios: any[] = [];
  verFormParqueadero: boolean = false;
  verFormVehiculo: boolean = false;
  verFormUsuario: boolean = false;
  selectedParqueadero: any = {};
  selectedVehiculo: any = {};

  constructor(private api: ApiConection, private fb: FormBuilder, private http: HttpClient) {
    // Inicialización de formularios reactivos
    this.formParqueadero = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      nit: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required]
    });

    this.formVehiculo = this.fb.group({
      id: [''],
      placa: ['', Validators.required],
      propietario_id: ['', Validators.required],
      parqueadero_id: ['', Validators.required],
    });

    this.formUsuario = this.fb.group({
      id: [''],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      parqueadero_id: ['', Validators.required],
    });

    this.formTarifa = this.fb.group({
      id: [''],
      parqueadero_id: ['', Validators.required],
      tamano: ['', Validators.required],
      precio: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home'
      },
    ];
    this.listaParqueaderos();
    this.listaVehiculos();
    this.listaPropietarios();
  }

  // Función para obtener la lista de parqueaderos
  listaParqueaderos() {
    this.http.get('http://localhost:8000/parqueadero/')
      .subscribe((data: any) => {
        this.parqueaderos = data;
      });
  }

  // Función para obtener la lista de vehículos
  listaVehiculos() {
    this.http.get('http://localhost:8000/vehiculo/')
      .subscribe((data: any) => {
        this.vehiculos = data;
      });
  }

  // Función para obtener la lista de propietarios
  listaPropietarios() {
    this.http.get('http://localhost:8000/propietario/')
      .subscribe((data: any) => {
        this.propietarios = data;
      });
  }

  // Acción para manejar el formulario de parqueadero
  accionFormularioParqueadero() {
    if (this.formParqueadero.value['id']) {
      this.updateParqueadero();
    } else {
      this.addParqueadero();
    }
  }

  // Crear un parqueadero
  addParqueadero() {
    this.http.post('http://localhost:8000/parqueadero/', this.formParqueadero.value)
      .subscribe(() => {
        this.listaParqueaderos();
        this.verFormParqueadero = false;
        this.formParqueadero.reset();
      });
  }

  // Actualizar un parqueadero
  updateParqueadero() {
    this.http.put(`http://localhost:8000/parqueadero/${this.selectedParqueadero.id}/`, this.formParqueadero.value)
      .subscribe(() => {
        this.listaParqueaderos();
        this.verFormParqueadero = false;
        this.formParqueadero.reset();
      });
  }

  // Acción para manejar el formulario de vehículo
  accionFormularioVehiculo() {
    if (this.formVehiculo.value['id']) {
      this.updateVehiculo();
    } else {
      this.addVehiculo();
    }
  }

  // Crear un vehículo
  addVehiculo() {
    this.http.post('http://localhost:8000/vehiculo/', this.formVehiculo.value)
      .subscribe(() => {
        this.listaVehiculos();
        this.verFormVehiculo = false;
        this.formVehiculo.reset();
      });
  }

  // Actualizar un vehículo
  updateVehiculo() {
    this.http.put(`http://localhost:8000/vehiculo/${this.selectedVehiculo.id}/`, this.formVehiculo.value)
      .subscribe(() => {
        this.listaVehiculos();
        this.verFormVehiculo = false;
        this.formVehiculo.reset();
      });
  }

  // Acción para manejar el formulario de usuario
  accionFormularioUsuario() {
    this.addUsuario();
  }

  // Crear un usuario
  addUsuario() {
    this.http.post('http://localhost:8000/usuario/', this.formUsuario.value)
      .subscribe(() => {
        this.verFormUsuario = false;
        this.formUsuario.reset();
      });
  }

  // Seleccionar un parqueadero
  seleccionarParqueadero() {
    this.formParqueadero.patchValue(this.selectedParqueadero);
    this.verFormParqueadero = true;
  }

  // Seleccionar un vehículo
  seleccionarVehiculo() {
    this.formVehiculo.patchValue(this.selectedVehiculo);
    this.verFormVehiculo = true;
  }

  // Cancelar el formulario
  cancel() {
    this.formParqueadero.reset();
    this.formVehiculo.reset();
    this.formUsuario.reset();
    this.verFormParqueadero = false;
    this.verFormVehiculo = false;
    this.verFormUsuario = false;
    this.selectedParqueadero = {};
    this.selectedVehiculo = {};
  }
}
