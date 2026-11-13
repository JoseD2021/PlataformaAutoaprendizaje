import { GuiasHttpRepository } from '../features/guias/infrastructure/guias-http-repository'
import { httpClient } from '../shared/http/client'
import { BuscarGuias } from '../features/guias/application/buscar-guias'
import { ListarCategorias } from '../features/guias/application/listar-categorias'
import { ListarGuiasPorCategoria } from '../features/guias/application/listar-guias-por-categoria'
import { ObtenerCategoria } from '../features/guias/application/obtener-categoria'
import { ObtenerGuia } from '../features/guias/application/obtener-guia'
import type { GuiasRepository } from '../features/guias/domain/guias-repository'
import { ObtenerInformacionSala } from '../features/sala/application/obtener-informacion-sala'
import { SalaHttpRepository } from '../features/sala/infrastructure/sala-http-repository'
import { AuthHttpRepository } from '../features/auth/infrastructure/auth-http-repository'
import { CerrarSesion } from '../features/auth/application/cerrar-sesion'
import { IniciarSesion } from '../features/auth/application/iniciar-sesion'
import { ObtenerPerfil } from '../features/auth/application/obtener-perfil'
import { RegistrarUsuario } from '../features/auth/application/registrar-usuario'
import { FavoritosHttpRepository } from '../features/favoritos/infrastructure/favoritos-http-repository'
import { AgregarFavorito } from '../features/favoritos/application/agregar-favorito'
import { ListarFavoritos } from '../features/favoritos/application/listar-favoritos'
import { QuitarFavorito } from '../features/favoritos/application/quitar-favorito'
import { GestionHttpRepository } from '../features/gestion/infrastructure/gestion-http-repository'
import { ListarGuiasGestion } from '../features/gestion/application/listar-guias-gestion'
import { ObtenerGuiaGestion } from '../features/gestion/application/obtener-guia-gestion'
import { CrearGuia } from '../features/gestion/application/crear-guia'
import { ActualizarGuia } from '../features/gestion/application/actualizar-guia'
import { EliminarGuia } from '../features/gestion/application/eliminar-guia'
import { CambiarEstadoGuia } from '../features/gestion/application/cambiar-estado-guia'
import { ListarCategoriasGestion } from '../features/gestion/application/listar-categorias-gestion'
import { CrearCategoria } from '../features/gestion/application/crear-categoria'
import { ActualizarCategoria } from '../features/gestion/application/actualizar-categoria'
import { EliminarCategoria } from '../features/gestion/application/eliminar-categoria'
import { AdminHttpRepository } from '../features/admin/infrastructure/admin-http-repository'
import { ListarUsuarios } from '../features/admin/application/listar-usuarios'
import { CambiarRolUsuario } from '../features/admin/application/cambiar-rol-usuario'
import { ListarRoles } from '../features/admin/application/listar-roles'
import { PrivacidadHttpRepository } from '../features/privacidad/infrastructure/privacidad-http-repository'
import { ObtenerTerminosPrivacidad } from '../features/privacidad/application/obtener-terminos-privacidad'

export function crearContenedor(repoOverride?: GuiasRepository) {
  const repo = repoOverride ?? new GuiasHttpRepository(httpClient)
  const salaRepo = new SalaHttpRepository()
  const authRepo = new AuthHttpRepository(httpClient)
  const gestionRepo = new GestionHttpRepository(httpClient)
  const favoritosRepo = new FavoritosHttpRepository(httpClient)
  const adminRepo = new AdminHttpRepository(httpClient)
  const privacidadRepo = new PrivacidadHttpRepository(httpClient)
  return {
    obtenerInformacionSala: new ObtenerInformacionSala(salaRepo),
    listarCategorias: new ListarCategorias(repo),
    listarGuiasPorCategoria: new ListarGuiasPorCategoria(repo),
    obtenerCategoria: new ObtenerCategoria(repo),
    obtenerGuia: new ObtenerGuia(repo),
    buscarGuias: new BuscarGuias(repo),
    iniciarSesion: new IniciarSesion(authRepo),
    registrarUsuario: new RegistrarUsuario(authRepo),
    cerrarSesion: new CerrarSesion(authRepo),
    obtenerPerfil: new ObtenerPerfil(authRepo),
    listarFavoritos: new ListarFavoritos(favoritosRepo),
    agregarFavorito: new AgregarFavorito(favoritosRepo),
    quitarFavorito: new QuitarFavorito(favoritosRepo),
    listarGuiasGestion: new ListarGuiasGestion(gestionRepo),
    obtenerGuiaGestion: new ObtenerGuiaGestion(gestionRepo),
    crearGuia: new CrearGuia(gestionRepo),
    actualizarGuia: new ActualizarGuia(gestionRepo),
    eliminarGuia: new EliminarGuia(gestionRepo),
    cambiarEstadoGuia: new CambiarEstadoGuia(gestionRepo),
    listarCategoriasGestion: new ListarCategoriasGestion(gestionRepo),
    crearCategoria: new CrearCategoria(gestionRepo),
    actualizarCategoria: new ActualizarCategoria(gestionRepo),
    eliminarCategoria: new EliminarCategoria(gestionRepo),
    listarUsuarios: new ListarUsuarios(adminRepo),
    cambiarRolUsuario: new CambiarRolUsuario(adminRepo),
    listarRoles: new ListarRoles(adminRepo),
    obtenerTerminosPrivacidad: new ObtenerTerminosPrivacidad(privacidadRepo),
  }
}

export const container = crearContenedor()
