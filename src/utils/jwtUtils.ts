// Utilidades para manejar tokens JWT

/**
 * Decodifica un token JWT y extrae la información (payload)
 * @param token Token JWT a decodificar
 * @returns El payload decodificado o null si hay un error
 */
export function decodeJwt(token: string): any {
  try {
    // Separar las partes del token (header.payload.signature)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando el token JWT:', error);
    return null;
  }
}

/**
 * Verifica si un token JWT ha expirado
 * @param token Token JWT a verificar
 * @returns true si el token ha expirado, false en caso contrario
 */
export function isTokenExpired(token: string): boolean {
  const decodedToken = decodeJwt(token);
  if (!decodedToken) {
    return true;
  }

  // Obtener el tiempo actual en segundos
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Verificar si el token tiene fecha de expiración
  if (!decodedToken.exp) {
    return false;
  }
  
  // Comparar la fecha de expiración con el tiempo actual
  return decodedToken.exp < currentTime;
}

/**
 * Extrae el rol de usuario del token JWT
 * @param token Token JWT 
 * @returns El rol del usuario o null si no se puede extraer
 */
export function getUserRoleFromToken(token: string): string | null {
  const decodedToken = decodeJwt(token);
  if (!decodedToken) {
    return null;
  }
  
  // La propiedad que contiene el rol puede variar según la implementación
  // Verificar diferentes posibles nombres de propiedades
  return decodedToken.rol || decodedToken.role || null;
}

/**
 * Extrae el username del token JWT
 * @param token Token JWT
 * @returns El username del usuario o null si no se puede extraer
 */
export function getUsernameFromToken(token: string): string | null {
  const decodedToken = decodeJwt(token);
  if (!decodedToken) {
    return null;
  }
  
  return decodedToken.username || decodedToken.sub || null;
}
