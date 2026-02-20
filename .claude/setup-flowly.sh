#!/bin/bash

# ============================================================================
# FLOWLY PROJECT SETUP SCRIPT
# Script para automatizar la instalación de Flowly
# Uso: bash setup-flowly.sh
# ============================================================================

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         FLOWLY - Plataforma de Productividad Personal         ║"
echo "║                    Setup Automático                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Verificar requisitos
print_status "Verificando requisitos..."

if ! command -v php &> /dev/null; then
    print_error "PHP no está instalado"
    exit 1
fi
print_success "PHP $(php --version | head -n 1 | grep -oP '\d+\.\d+\.\d+')"

if ! command -v composer &> /dev/null; then
    print_error "Composer no está instalado"
    exit 1
fi
print_success "Composer está instalado"

if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi
print_success "Node.js $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi
print_success "npm $(npm --version)"

if ! command -v git &> /dev/null; then
    print_error "Git no está instalado"
    exit 1
fi
print_success "Git está instalado"

echo ""

# Pregunta por nombre del proyecto
read -p "$(echo -e ${BLUE}▶${NC} 'Nombre del proyecto (por defecto: flowly): ')" PROJECT_NAME
PROJECT_NAME="${PROJECT_NAME:-flowly}"

print_status "Creando proyecto: $PROJECT_NAME"

# Crear proyecto Laravel
if [ -d "$PROJECT_NAME" ]; then
    print_warning "La carpeta $PROJECT_NAME ya existe"
    read -p "¿Deseas continuar? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        print_error "Instalación cancelada"
        exit 1
    fi
else
    laravel new "$PROJECT_NAME"
    print_success "Proyecto Laravel creado"
fi

cd "$PROJECT_NAME"

print_status "Instalando dependencias..."

# Composer
composer install -q
print_success "Dependencias PHP instaladas"

# npm
npm install -q
print_success "Dependencias JavaScript instaladas"

print_status "Configurando entorno..."

# Copiar .env
if [ ! -f .env ]; then
    cp .env.example .env
    print_success "Archivo .env creado"
else
    print_warning "Archivo .env ya existe"
fi

# Generar key
php artisan key:generate --quiet
print_success "APP_KEY generada"

print_status "Configurando base de datos..."

# Crear database.sqlite
touch database/database.sqlite
print_success "Base de datos SQLite creada"

# Ejecutar migrations y seeders
print_status "Ejecutando migrations y seeders..."
php artisan migrate:fresh --seed --quiet
print_success "Base de datos migrada y poblada"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   ¡SETUP COMPLETADO!                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

print_success "Flowly está listo para usar"
echo ""

echo "Próximos pasos:"
echo ""
echo "  1. Entra a la carpeta del proyecto:"
echo "     ${BLUE}cd $PROJECT_NAME${NC}"
echo ""
echo "  2. Inicia el servidor (en una terminal):"
echo "     ${BLUE}php artisan serve${NC}"
echo ""
echo "  3. Inicia el bundler (en otra terminal):"
echo "     ${BLUE}npm run dev${NC}"
echo ""
echo "  4. Abre en tu navegador:"
echo "     ${BLUE}http://localhost:8000${NC}"
echo ""
echo "  5. Credenciales de prueba:"
echo "     Admin:        ${BLUE}admin@flowly.test${NC} / password"
echo "     Premium User: ${BLUE}premium@flowly.test${NC} / password"
echo "     Free User:    ${BLUE}free@flowly.test${NC} / password"
echo ""

echo "Comandos útiles:"
echo "  - Tests:      ${BLUE}php artisan test${NC}"
echo "  - Debugging:  ${BLUE}php artisan tinker${NC}"
echo "  - Rutas:      ${BLUE}php artisan route:list${NC}"
echo "  - DB Reset:   ${BLUE}php artisan migrate:fresh --seed${NC}"
echo ""

print_success "¡Felicidades! Tu proyecto Flowly está listo para desarrollar 🚀"
echo ""
