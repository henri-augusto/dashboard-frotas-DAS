# Controle de Viaturas DAS

Plataforma Next.js para controle de viaturas do Departamento de Aplicações e Sistemas (DAS) da DTIC.

## Funcionalidades

- **Usuário (mobile-first):** formulário para iniciar serviço e encerrar com KM final e novidades.
- **Administrador:** dashboard com totais, cadastro de viaturas e relatórios com filtros.

## Tecnologias

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma + PostgreSQL
- Zod

## Instalação

```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

Acesse: http://localhost:3000

## Credenciais padrão (admin)

- E-mail: `admin@das.local`
- Senha: `admin123`

Configure em `.env`:

```
DATABASE_URL="postgresql://usuario:senha@host:5432/controle_viaturas_das?schema=public"
ADMIN_SESSION_SECRET="sua-chave-secreta"
ADMIN_EMAIL="admin@das.local"
ADMIN_PASSWORD="admin123"
```

Se o Postgres exigir SSL, adicione `&sslmode=require` na `DATABASE_URL`.

`ADMIN_SESSION_SECRET` é obrigatório em produção. Após atualizações de segurança da sessão, faça login novamente no painel admin (cookies antigos deixam de valer).

## Docker

Defina `DATABASE_URL` no `.env` apontando para o PostgreSQL externo antes de subir:

```bash
docker compose up -d --build
```

O entrypoint aplica as migrações com `prisma migrate deploy` e executa o seed se `RUN_DB_SEED=true`.

## Cores

- Primária: `#333`
- Secundária: `#FF0E18`
