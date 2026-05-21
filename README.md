# Controle de Viaturas DAS

Plataforma Next.js para controle de viaturas do Departamento de Aplicações e Sistemas (DAS) da DTIC.

## Funcionalidades

- **Usuário (mobile-first):** formulário para iniciar serviço e encerrar com KM final e novidades.
- **Administrador:** dashboard com totais, cadastro de viaturas e relatórios com filtros.

## Tecnologias

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma + SQLite
- Zod

## Instalação

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Acesse: http://localhost:3000

## Credenciais padrão (admin)

- E-mail: `admin@das.local`
- Senha: `admin123`

Configure em `.env`:

```
DATABASE_URL="file:./dev.db"
ADMIN_SESSION_SECRET="sua-chave-secreta"
ADMIN_EMAIL="admin@das.local"
ADMIN_PASSWORD="admin123"
```

## Cores

- Primária: `#333`
- Secundária: `#FF0E18`
