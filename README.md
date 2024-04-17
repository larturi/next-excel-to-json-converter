# Next 13 Excel to JSON Converter

## Tecnologies

- Next 13.5.4
- Node 18.14.1
- Next Auth
- Google Auth
- Prisma
- MongoDB

## Getting Started

- Generar el archivo .env en base a ,env.template

- Instalar dependencias
  
```bash
nvm use 18.17.0
pnpm install
```

Configurar la base de datos con Prisma

```bash
npx prisma db push
npx prisma generate
```

Levantar la aplicación

```bash
nvm use 18.17.0

pnpm dev
```
