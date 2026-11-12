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

export function crearContenedor(repoOverride?: GuiasRepository) {
  const repo = repoOverride ?? new GuiasHttpRepository(httpClient)
  const salaRepo = new SalaHttpRepository()
  const authRepo = new AuthHttpRepository(httpClient)
  const favoritosRepo = new FavoritosHttpRepository(httpClient)
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
  }
}

export const container = crearContenedor()
