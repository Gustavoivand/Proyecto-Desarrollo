import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegistrarIncidencia from '../RegistrarIncidencia';

// Mock del navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('S034: RegistrarIncidencia Form Validation Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('currentUser', JSON.stringify({ nombre: 'Carlos Soporte', rol: 'jefe' }));
    localStorage.setItem('token', 'mock-token');
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  test('Debe renderizar todos los campos requeridos en el formulario', () => {
    render(
      <MemoryRouter>
        <RegistrarIncidencia />
      </MemoryRouter>
    );

    const inputCodigo = screen.getByPlaceholderText('Ej: EQ-1054');
    const inputProblema = screen.getByPlaceholderText(/Describa el problema/i);
    const inputUsuario = screen.getByPlaceholderText('Nombre del usuario del equipo');
    const inputRegistrado = screen.getByPlaceholderText('Tu nombre (Quien registra)');
    const btnSubmit = screen.getByRole('button', { name: /Registrar Incidencia/i });

    expect(inputCodigo).toBeInTheDocument();
    expect(inputCodigo).toHaveAttribute('required');

    expect(inputProblema).toBeInTheDocument();
    expect(inputProblema).toHaveAttribute('required');

    expect(inputUsuario).toBeInTheDocument();
    expect(inputUsuario).toHaveAttribute('required');

    expect(inputRegistrado).toBeInTheDocument();
    expect(inputRegistrado).toHaveAttribute('required');

    expect(btnSubmit).toBeInTheDocument();
  });

  test('Debe enviar los datos correctamente si todos los campos están llenos', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'INC-9999' }),
    });

    render(
      <MemoryRouter>
        <RegistrarIncidencia />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Ej: EQ-1054'), { target: { value: 'SOP-L01' } });
    fireEvent.change(screen.getByPlaceholderText(/Describa el problema/i), { target: { value: 'No enciende' } });
    fireEvent.change(screen.getByPlaceholderText('Nombre del usuario del equipo'), { target: { value: 'Ana Perez' } });
    fireEvent.change(screen.getByPlaceholderText('Tu nombre (Quien registra)'), { target: { value: 'Carlos Soporte' } });

    fireEvent.click(screen.getByRole('button', { name: /Registrar Incidencia/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/incidencias', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          codigoEquipo: 'SOP-L01',
          problema: 'No enciende',
          usuarioResponsable: 'Ana Perez',
          registradoPor: 'Carlos Soporte',
        }),
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/bandeja');
    });
  });

  test('Debe mostrar un mensaje de error si la petición al servidor falla', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'El equipo SOP-INVALID no existe en el inventario real.' }),
    });

    render(
      <MemoryRouter>
        <RegistrarIncidencia />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Ej: EQ-1054'), { target: { value: 'SOP-INVALID' } });
    fireEvent.change(screen.getByPlaceholderText(/Describa el problema/i), { target: { value: 'Error grave' } });
    fireEvent.change(screen.getByPlaceholderText('Nombre del usuario del equipo'), { target: { value: 'Sandro' } });
    fireEvent.change(screen.getByPlaceholderText('Tu nombre (Quien registra)'), { target: { value: 'Admin' } });

    fireEvent.click(screen.getByRole('button', { name: /Registrar Incidencia/i }));

    await waitFor(() => {
      expect(screen.getByText('El equipo SOP-INVALID no existe en el inventario real.')).toBeInTheDocument();
    });
  });
});
