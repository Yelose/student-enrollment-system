import { TestBed } from '@angular/core/testing';

import { SnackBarService } from './snack-bar-service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SnackBarService', () => {
  let service: SnackBarService;
  let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>

  beforeEach(() => {
    const spy = jasmine.createSpyObj("MatSnackBar", ["open"])

    TestBed.configureTestingModule({
      providers: [
        SnackBarService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });
    service = TestBed.inject(SnackBarService);
    matSnackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call open() with default type info', () => {
    service.show('Mensaje de prueba');
    expect(matSnackBarSpy.open).toHaveBeenCalledWith(
      'Mensaje de prueba',
      'Cerrar',
      jasmine.objectContaining({
        duration: 3000,
        panelClass: ['snackbar-info'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      })
    );
  });

  it('should call open() with custom type success', () => {
    service.show('Éxito', 'success');
    expect(matSnackBarSpy.open).toHaveBeenCalledWith(
      'Éxito',
      'Cerrar',
      jasmine.objectContaining({
        panelClass: ['snackbar-success'],
      })
    );
  });

  it('should call open() with custom duration and type error', () => {
    service.show('Error crítico', 'error', 5000);
    expect(matSnackBarSpy.open).toHaveBeenCalledWith(
      'Error crítico',
      'Cerrar',
      jasmine.objectContaining({
        duration: 5000,
        panelClass: ['snackbar-error'],
      })
    );
  });
});
