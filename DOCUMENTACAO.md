# Documentacao do Sistema - Controle de Viaturas DAS

## 1. Visao Geral

O **Controle de Viaturas DAS** e uma aplicacao web criada para registrar, acompanhar e consultar o uso de viaturas do Departamento de Aplicacoes e Sistemas (DAS) da DTIC.

O sistema possui dois perfis principais de uso:

- **Usuario operacional:** acessa a pagina inicial para iniciar um servico com uma viatura disponivel, consultar servicos abertos pelo RE e encerrar o servico informando KM final e novidades.
- **Administrador:** acessa uma area restrita para consultar indicadores da frota, cadastrar viaturas, alterar status, registrar baixas, registrar retorno de baixas e consultar relatorios.

A aplicacao foi desenvolvida com foco em uso simples, rapido e responsivo, especialmente para preenchimento em dispositivos moveis.

## 2. Objetivos do Sistema

O sistema tem como objetivos:

- Controlar quais viaturas estao disponiveis, em uso ou baixadas.
- Registrar a abertura de servicos com dados do militar, viatura, destino, missao e KM inicial.
- Impedir que uma mesma viatura disponivel seja usada simultaneamente por mais de um servico.
- Permitir que o militar consulte servicos abertos pelo proprio RE antes de iniciar um novo.
- Registrar encerramento do servico com KM final e novidades.
- Gerar relatorio em PDF para servicos encerrados.
- Manter historico de uso das viaturas para consulta administrativa.
- Registrar baixas e retornos de baixa de viaturas.
- Oferecer indicadores rapidos no painel administrativo.

## 3. Tecnologias Utilizadas

O projeto utiliza:

- **Next.js 15** com App Router.
- **React 19**.
- **TypeScript**.
- **Tailwind CSS v4**.
- **Prisma ORM**.
- **SQLite** como banco de dados local.
- **Zod** para validacao dos formularios.
- **bcryptjs** para hash e verificacao de senha administrativa.
- **pdfkit** para geracao de relatorios em PDF.

## 4. Estrutura Geral do Projeto

Principais diretorios e arquivos:

```text
app/
  page.tsx                         Pagina publica inicial
  layout.tsx                       Layout global da aplicacao
  globals.css                      Estilos globais
  admin/
    layout.tsx                     Layout da area administrativa
    page.tsx                       Dashboard administrativo
    login/page.tsx                 Login do administrador
    viaturas/page.tsx              Cadastro e status das viaturas
    relatorios/page.tsx            Consulta de relatorios
  servico/[id]/
    encerrar/page.tsx              Tela de encerramento de servico
    relatorio/route.ts             Rota de download do PDF

components/
  admin/                           Componentes da area administrativa
  forms/                           Formularios de servico, login e viaturas
  layout/                          Componentes de layout
  ui/                              Componentes visuais reutilizaveis

lib/
  actions/                         Server actions da aplicacao
  reports/service-pdf.ts           Geracao do PDF do relatorio
  validations/                     Schemas Zod de validacao
  auth.ts                          Autenticacao administrativa
  prisma.ts                        Cliente Prisma

prisma/
  schema.prisma                    Modelos do banco de dados
  seed.ts                          Carga inicial de administrador e viaturas

middleware.ts                      Protecao das rotas administrativas
package.json                       Dependencias e scripts
README.md                         Resumo rapido do projeto
```

## 5. Instalacao e Execucao

### 5.1. Pre-requisitos

Antes de executar o projeto, instale:

- Node.js em versao compativel com Next.js 15.
- npm.

### 5.2. Instalar dependencias

```bash
npm install
```

### 5.3. Configurar variaveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL="file:./dev.db"
ADMIN_SESSION_SECRET="sua-chave-secreta"
ADMIN_EMAIL="admin@das.local"
ADMIN_PASSWORD="admin123"
```

Descricao das variaveis:

- `DATABASE_URL`: define o caminho do banco SQLite usado pelo Prisma.
- `ADMIN_SESSION_SECRET`: segredo usado para compor o cookie de sessao administrativa.
- `ADMIN_EMAIL`: e-mail do administrador criado ou atualizado pelo seed.
- `ADMIN_PASSWORD`: senha do administrador criada ou atualizada pelo seed.

Em producao, altere `ADMIN_SESSION_SECRET` e `ADMIN_PASSWORD` para valores fortes.

### 5.4. Criar estrutura do banco

```bash
npx prisma db push
```

ou:

```bash
npm run db:push
```

### 5.5. Executar seed inicial

```bash
npm run db:seed
```

O seed cria ou atualiza:

- Um usuario administrador.
- Viaturas iniciais de exemplo.

Credenciais padrao, se nenhuma variavel for configurada:

- E-mail: `admin@das.local`
- Senha: `admin123`

### 5.6. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

### 5.7. Build e execucao em producao

```bash
npm run build
npm run start
```

## 6. Scripts Disponiveis

No `package.json`, os principais scripts sao:

```bash
npm run dev
```

Inicia o servidor de desenvolvimento com Turbopack.

```bash
npm run build
```

Gera a build de producao.

```bash
npm run start
```

Executa a build de producao.

```bash
npm run lint
```

Executa verificacao de lint configurada para Next.js.

```bash
npm run db:generate
```

Gera o Prisma Client.

```bash
npm run db:migrate
```

Executa migracoes Prisma em desenvolvimento.

```bash
npm run db:push
```

Sincroniza o schema Prisma com o banco sem criar migracao formal.

```bash
npm run db:seed
```

Executa a carga inicial do banco.

## 7. Modelo de Dados

O banco e definido em `prisma/schema.prisma`.

### 7.1. Vehicle

Representa uma viatura.

Campos principais:

- `id`: identificador unico.
- `prefixo`: prefixo da viatura, unico no sistema.
- `modelo`: modelo da viatura.
- `patrimonio`: numero de patrimonio.
- `placa`: placa da viatura.
- `status`: status atual da viatura.
- `createdAt`: data de criacao.
- `updatedAt`: data da ultima atualizacao.

Relacionamentos:

- Uma viatura pode ter varios relatorios de servico.
- Uma viatura pode ter varios registros de baixa.

### 7.2. VehicleStatus

Status possiveis de uma viatura:

- `DISPONIVEL`: viatura disponivel para novo servico.
- `EM_USO`: viatura associada a um servico aberto.
- `BAIXADA`: viatura indisponivel por baixa administrativa, manutencao ou outro motivo.

### 7.3. VehicleDischarge

Representa uma baixa de viatura.

Campos principais:

- `id`: identificador unico.
- `vehicleId`: viatura relacionada.
- `dischargedAt`: data da baixa.
- `returnedAt`: data de retorno, quando houver.
- `motivo`: motivo da baixa.
- `numeroProcesso`: processo relacionado a baixa.
- `autorBaixa`: responsavel pelo registro da baixa.
- `destino`: destino da viatura durante a baixa.
- `createdAt`: data de criacao do registro.

Quando `returnedAt` esta vazio, a baixa e considerada ativa.

### 7.4. ServiceReport

Representa um relatorio de servico.

Campos principais:

- `id`: identificador unico do servico.
- `reMilitar`: RE do militar.
- `nomeGuerra`: nome de guerra do militar.
- `vehicleId`: viatura usada.
- `kmInicial`: quilometragem inicial.
- `kmFinal`: quilometragem final, preenchida no encerramento.
- `destino`: destino do servico.
- `missao`: missao realizada.
- `encarregado`: encarregado pelo servico.
- `observacoes`: observacoes registradas na abertura.
- `novidades`: novidades registradas no encerramento.
- `status`: status do relatorio.
- `startedAt`: data e hora de inicio.
- `endedAt`: data e hora de encerramento.
- `createdAt`: data de criacao.
- `updatedAt`: data da ultima atualizacao.

### 7.5. ServiceStatus

Status possiveis de um relatorio:

- `ABERTO`: servico iniciado e ainda nao encerrado.
- `ENCERRADO`: servico finalizado com KM final.

### 7.6. AdminUser

Representa um usuario administrador.

Campos principais:

- `id`: identificador unico.
- `email`: e-mail de login, unico.
- `passwordHash`: hash da senha.
- `createdAt`: data de criacao.

## 8. Fluxo do Usuario Operacional

### 8.1. Pagina inicial

Rota:

```text
/
```

A pagina inicial carrega apenas as viaturas com status `DISPONIVEL` e exibe o formulario de servico.

### 8.2. Consulta por RE

Antes de iniciar um novo servico, o usuario informa o RE militar.

Validacao:

- O RE deve conter exatamente 6 numeros.

O sistema consulta se existem servicos abertos para esse RE.

Se houver servicos abertos:

- O sistema lista os servicos encontrados.
- O usuario pode selecionar um deles para encerrar.
- O sistema evita que o usuario inicie outro servico sem primeiro visualizar pendencias.

Se nao houver servico aberto:

- O sistema libera o formulario de abertura de novo servico.

### 8.3. Abertura de servico

Campos exigidos:

- RE do militar.
- Nome de guerra.
- Prefixo da viatura.
- KM inicial.
- Destino.
- Missao.
- Encarregado.

Campo opcional:

- Observacoes.

Ao selecionar a viatura, o formulario exibe automaticamente:

- Modelo.
- Patrimonio.
- Placa.

Regras aplicadas:

- A viatura precisa existir.
- A viatura precisa estar com status `DISPONIVEL`.
- O KM inicial precisa ser inteiro e maior ou igual a zero.
- Os campos textuais obrigatorios precisam ter conteudo minimo.

Ao iniciar o servico, o sistema executa uma transacao:

1. Atualiza a viatura de `DISPONIVEL` para `EM_USO`.
2. Cria o registro `ServiceReport` com status `ABERTO`.

Esse comportamento reduz o risco de duas pessoas iniciarem servicos com a mesma viatura ao mesmo tempo.

### 8.4. Encerramento de servico

Rota:

```text
/servico/[id]/encerrar
```

O encerramento carrega o servico pelo `id`.

Se o servico nao existir:

- A pagina retorna erro de nao encontrado.

Se o servico ja estiver encerrado:

- O sistema informa que o servico ja foi finalizado.
- O usuario pode baixar o PDF do relatorio.

Se o servico estiver aberto:

- O formulario exibe a viatura e o KM inicial.
- O usuario informa o KM final.
- O usuario pode preencher novidades.

Regras aplicadas:

- O KM final precisa ser inteiro e maior ou igual a zero.
- O KM final nao pode ser menor que o KM inicial.
- O servico precisa estar com status `ABERTO`.

Ao encerrar, o sistema executa uma transacao:

1. Atualiza o relatorio para `ENCERRADO`.
2. Grava `kmFinal`, `novidades` e `endedAt`.
3. Se a viatura nao estiver `BAIXADA`, retorna o status da viatura para `DISPONIVEL`.

### 8.5. Download do relatorio em PDF

Rota:

```text
/servico/[id]/relatorio
```

O PDF so e gerado se:

- O servico existir.
- O servico estiver com status `ENCERRADO`.

Se o servico estiver aberto, a rota retorna erro informando que o PDF so esta disponivel apos o encerramento.

Nome do arquivo gerado:

```text
relatorio-DDMMMAA-PREFIXO-RE.pdf
```

Exemplo:

```text
relatorio-21MAI26-VTR-01-123456.pdf
```

Observacao: o nome real usa meses abreviados em portugues sem acento, como `JAN`, `FEV`, `MAR`, `ABR`, `MAI`, `JUN`, `JUL`, `AGO`, `SET`, `OUT`, `NOV`, `DEZ`.

## 9. Fluxo Administrativo

### 9.1. Login administrativo

Rota:

```text
/admin/login
```

O administrador informa:

- E-mail.
- Senha.

Validacao:

- O e-mail precisa ter formato valido.
- A senha precisa ser informada.

O sistema busca o administrador no banco e compara a senha informada com o hash salvo em `passwordHash`.

Se as credenciais forem validas:

- O sistema cria um cookie HTTP-only chamado `das_admin_session`.
- O usuario e redirecionado para `/admin`.

Se forem invalidas:

- O sistema retorna mensagem de erro.

### 9.2. Sessao administrativa

A sessao administrativa usa:

- Cookie: `das_admin_session`.
- Duracao: 8 horas.
- `httpOnly`: ativo.
- `sameSite`: `lax`.
- `secure`: ativo apenas quando `NODE_ENV=production`.

O token salvo no cookie contem o ID do administrador junto com o segredo definido em `ADMIN_SESSION_SECRET`, codificado em base64url.

Importante: em producao, o segredo deve ser forte e privado.

### 9.3. Protecao de rotas administrativas

O arquivo `middleware.ts` protege as rotas:

```text
/admin/:path*
```

Regras:

- Se o usuario acessar uma rota administrativa sem cookie de sessao, e redirecionado para `/admin/login`.
- Se o usuario acessar `/admin/login` ja autenticado, e redirecionado para `/admin`.

As server actions administrativas tambem chamam `requireAdmin()`, garantindo protecao no servidor.

### 9.4. Logout

O botao **Sair** remove o cookie de sessao e redireciona para:

```text
/admin/login
```

## 10. Dashboard Administrativo

Rota:

```text
/admin
```

O dashboard exibe:

- Total de viaturas.
- Viaturas disponiveis.
- Viaturas em uso.
- Viaturas baixadas.
- Relatorios em aberto.
- Viatura mais usada.
- Lista de viaturas baixadas com quantidade de dias baixada.

### 10.1. Calculo da viatura mais usada

O sistema agrupa os relatorios por `vehicleId`, conta a quantidade de usos e retorna a viatura com maior numero de relatorios.

### 10.2. Calculo de dias baixada

Para cada baixa ativa, o sistema calcula a diferenca entre a data atual e `dischargedAt`.

O valor minimo exibido e 1 dia.

## 11. Gestao de Viaturas

Rota:

```text
/admin/viaturas
```

A tela permite:

- Visualizar a frota cadastrada.
- Cadastrar nova viatura.
- Atualizar status de viaturas.
- Registrar baixa.
- Registrar retorno da baixa.

### 11.1. Cadastro de viatura

Campos:

- Prefixo.
- Modelo.
- Patrimonio.
- Placa.
- Status inicial.

Status inicial permitido no formulario:

- Disponivel.
- Baixada.

Regras:

- O prefixo e unico.
- Todos os campos principais sao obrigatorios.
- A placa precisa ter pelo menos 7 caracteres.

### 11.2. Atualizacao de status

Para viaturas que nao estao baixadas, o administrador pode atualizar status entre:

- Disponivel.
- Em uso.

Quando o administrador tenta selecionar `BAIXADA`, o sistema abre o formulario proprio de baixa. A action de atualizacao de status tambem bloqueia a mudanca direta para `BAIXADA`, exigindo o registro completo da baixa.

### 11.3. Registro de baixa

Campos:

- Data da baixa.
- Motivo.
- Numero do processo.
- Autor da baixa.
- Destino.

Regras:

- A viatura precisa existir.
- A viatura nao pode ja estar baixada.
- Todos os campos sao obrigatorios.

Ao registrar a baixa, o sistema executa uma transacao:

1. Cria um registro em `VehicleDischarge`.
2. Atualiza a viatura para status `BAIXADA`.

### 11.4. Retorno da baixa

Disponivel apenas para viaturas com status `BAIXADA`.

Campo:

- Data de retorno.

Regras:

- A viatura precisa existir.
- A viatura precisa estar baixada.
- Deve existir uma baixa ativa sem `returnedAt`.
- A data de retorno nao pode ser anterior a data da baixa.

Ao registrar o retorno, o sistema executa uma transacao:

1. Atualiza o registro de baixa ativo com `returnedAt`.
2. Atualiza a viatura para `DISPONIVEL`.

## 12. Relatorios Administrativos

Rota:

```text
/admin/relatorios
```

A tela lista os relatorios de servico registrados pelos usuarios.

### 12.1. Filtros disponiveis

Filtros:

- Status: todos, aberto ou encerrado.
- Viatura.
- Data inicial.
- Data final.

Os filtros sao aplicados por query string.

Exemplo:

```text
/admin/relatorios?status=ENCERRADO&from=2026-05-01&to=2026-05-21
```

### 12.2. Informacoes exibidas por relatorio

Cada item da lista exibe:

- Prefixo da viatura.
- Nome de guerra.
- RE.
- Status.
- ServiceID.
- Destino.
- Missao.
- Encarregado.
- KM inicial.
- KM final, quando houver.
- Data e hora de inicio.
- Data e hora de fim, quando houver.
- Observacoes.
- Novidades.

Para relatorios encerrados, a tela exibe o botao **Baixar PDF**.

## 13. Geracao de PDF

A geracao do PDF fica em:

```text
lib/reports/service-pdf.ts
```

O PDF e gerado com `pdfkit`.

Conteudo do documento:

- Cabecalho com titulo "Relatorio de Servico".
- Identificacao do servico.
- Dados do militar.
- Dados da viatura.
- Dados do servico.
- Observacoes, se houver.
- Novidades, se houver.
- Rodape com data de geracao.
- Aviso: "Documento apenas para suporte na elaboracao do RSM."

O calculo de KM percorrido e:

```text
kmFinal - kmInicial
```

O PDF e retornado como download pela rota:

```text
/servico/[id]/relatorio
```

Headers usados:

- `Content-Type: application/pdf`
- `Content-Disposition: attachment`
- `Cache-Control: no-store`

## 14. Validacoes

As validacoes principais ficam em:

```text
lib/validations/
```

### 14.1. Servicos

Arquivo:

```text
lib/validations/service.ts
```

Regras:

- RE militar: exatamente 6 numeros.
- Nome de guerra: minimo de 2 caracteres.
- Viatura: obrigatoria.
- KM inicial: numero inteiro maior ou igual a zero.
- Destino: minimo de 2 caracteres.
- Missao: minimo de 2 caracteres.
- Encarregado: minimo de 2 caracteres.
- KM final: numero inteiro maior ou igual a zero.

### 14.2. Viaturas

Arquivo:

```text
lib/validations/vehicle.ts
```

Regras:

- Prefixo: obrigatorio.
- Modelo: obrigatorio.
- Patrimonio: obrigatorio.
- Placa: minimo de 7 caracteres.
- Status: precisa ser `DISPONIVEL`, `EM_USO` ou `BAIXADA`.
- Baixa: data, motivo, processo, autor e destino obrigatorios.
- Retorno da baixa: data obrigatoria.

### 14.3. Login

Arquivo:

```text
lib/validations/auth.ts
```

Regras:

- E-mail valido.
- Senha com no minimo 6 caracteres.

## 15. Regras de Negocio

Principais regras implementadas:

- Apenas viaturas `DISPONIVEL` aparecem para abertura de novo servico.
- Antes de abrir servico, o usuario deve consultar o RE.
- Se houver servicos abertos para o RE, o sistema lista esses servicos para encerramento.
- Uma viatura passa para `EM_USO` quando um servico e aberto.
- Uma viatura volta para `DISPONIVEL` quando o servico e encerrado, desde que nao esteja baixada.
- O KM final nao pode ser menor que o KM inicial.
- PDF so pode ser baixado para servicos encerrados.
- Area administrativa exige sessao.
- Baixa de viatura exige formulario especifico com motivo, processo, autor e destino.
- Retorno de baixa so pode ocorrer se houver baixa ativa.
- Data de retorno da baixa nao pode ser anterior a data da baixa.
- Prefixo de viatura deve ser unico.

## 16. Rotas do Sistema

### 16.1. Rotas publicas

```text
/                              Pagina inicial de abertura/consulta de servico
/servico/[id]/encerrar         Encerramento de servico
/servico/[id]/relatorio        Download do PDF do relatorio encerrado
```

### 16.2. Rotas administrativas

```text
/admin                         Dashboard administrativo
/admin/login                   Login administrativo
/admin/viaturas                Gestao de viaturas
/admin/relatorios              Consulta de relatorios
```

## 17. Server Actions

As operacoes de escrita e leitura sensivel ficam em `lib/actions/`.

### 17.1. `lib/actions/service.ts`

Funcoes principais:

- `getAvailableVehicles()`: lista viaturas disponiveis.
- `lookupOpenServicesByRe()`: consulta servicos abertos por RE.
- `startService()`: inicia um servico.
- `endService()`: encerra um servico.
- `getServiceForEnd()`: busca um servico para a tela de encerramento.

### 17.2. `lib/actions/vehicle.ts`

Funcoes principais:

- `getAllVehicles()`: lista todas as viaturas para admin.
- `getDashboardStats()`: calcula indicadores do dashboard.
- `createVehicle()`: cadastra uma viatura.
- `updateVehicleStatus()`: atualiza status permitido.
- `dischargeVehicle()`: registra baixa de viatura.
- `revertVehicleDischarge()`: registra retorno de baixa.

### 17.3. `lib/actions/auth.ts`

Funcoes principais:

- `loginAdmin()`: valida credenciais e cria sessao.
- `logoutAdmin()`: encerra a sessao administrativa.

### 17.4. `lib/actions/reports.ts`

Funcao principal:

- `getServiceReports()`: lista relatorios com filtros de status, viatura e periodo.

## 18. Componentes Principais

### 18.1. Formularios

Diretorio:

```text
components/forms/
```

Componentes:

- `start-service-form.tsx`: consulta RE, lista servicos abertos e abre novo servico.
- `end-service-form.tsx`: encerra servico e libera download do PDF.
- `login-form.tsx`: login administrativo.
- `vehicle-form.tsx`: cadastro de viaturas.
- `vehicle-discharge-form.tsx`: registro de baixa.
- `vehicle-discharge-return-form.tsx`: retorno de baixa.

### 18.2. Administracao

Diretorio:

```text
components/admin/
```

Componentes:

- `vehicle-list.tsx`: lista viaturas e acoes por status.
- `create-vehicle-modal.tsx`: modal de cadastro de viatura.
- `reports-filter.tsx`: filtros da tela de relatorios.
- `refresh-dashboard-button.tsx`: botao para atualizar dashboard.

### 18.3. Layout

Diretorio:

```text
components/layout/
```

Componentes:

- `admin-shell.tsx`: cabecalho, navegacao e logout da area administrativa.
- `page-header.tsx`: titulo, subtitulo e acao das paginas.

### 18.4. UI

Diretorio:

```text
components/ui/
```

Componentes reutilizaveis:

- `button.tsx`
- `card.tsx`
- `input.tsx`
- `modal.tsx`
- `select.tsx`
- `textarea.tsx`

## 19. Seguranca

Medidas existentes:

- Senhas de administradores armazenadas com hash bcrypt.
- Cookie administrativo HTTP-only.
- Protecao de rotas administrativas via middleware.
- Verificacao administrativa tambem nas server actions.
- Validacao de entrada com Zod.
- PDF de relatorio bloqueado para servicos abertos.

Pontos de atencao:

- O segredo `ADMIN_SESSION_SECRET` deve ser forte em producao.
- A senha padrao `admin123` deve ser alterada.
- A sessao atual usa um token simples baseado em `adminId` e segredo; para ambientes mais sensiveis, considerar assinatura criptografica/HMAC ou biblioteca de sessao dedicada.
- Como o banco padrao e SQLite local, planeje backup e permissao de arquivo em producao.

## 20. Banco de Dados e Prisma

### 20.1. Gerar Prisma Client

```bash
npm run db:generate
```

### 20.2. Sincronizar schema

```bash
npm run db:push
```

### 20.3. Criar migracao em desenvolvimento

```bash
npm run db:migrate
```

### 20.4. Popular dados iniciais

```bash
npm run db:seed
```

O seed usa as variaveis:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Se nao existirem, usa:

- `admin@das.local`
- `admin123`

## 21. Fluxos Resumidos

### 21.1. Inicio de servico

```text
Usuario acessa /
Informa RE
Sistema consulta servicos abertos
Se houver servico aberto, usuario e direcionado ao encerramento
Se nao houver, usuario preenche dados do novo servico
Sistema valida dados
Sistema marca viatura como EM_USO
Sistema cria ServiceReport ABERTO
```

### 21.2. Encerramento de servico

```text
Usuario acessa /servico/[id]/encerrar
Sistema carrega servico
Usuario informa KM final e novidades
Sistema valida KM final
Sistema marca ServiceReport como ENCERRADO
Sistema registra endedAt
Sistema libera viatura se ela nao estiver BAIXADA
Sistema libera download do PDF
```

### 21.3. Baixa de viatura

```text
Admin acessa /admin/viaturas
Seleciona status Baixada
Sistema abre formulario de baixa
Admin informa data, motivo, processo, autor e destino
Sistema cria VehicleDischarge
Sistema marca viatura como BAIXADA
```

### 21.4. Retorno de baixa

```text
Admin acessa /admin/viaturas
Seleciona Retorno da baixa em uma viatura baixada
Admin informa data de retorno
Sistema valida baixa ativa
Sistema atualiza returnedAt
Sistema marca viatura como DISPONIVEL
```

## 22. Possiveis Melhorias Futuras

Sugestoes de evolucao:

- Criar controle de perfis administrativos com permissoes.
- Adicionar auditoria de acoes administrativas.
- Adicionar exportacao de relatorios em CSV ou Excel.
- Permitir busca textual por RE, nome de guerra, destino ou missao.
- Criar pagina de detalhes completa para cada relatorio.
- Criar historico detalhado de baixas por viatura.
- Adicionar testes automatizados para regras de negocio.
- Melhorar sessao administrativa com token assinado por HMAC ou biblioteca dedicada.
- Adicionar pagina de troca de senha do administrador.
- Criar rotina de backup do banco SQLite.
- Migrar para PostgreSQL em ambiente multiusuario ou producao.

## 23. Guia Rapido para Operacao

### Usuario operacional

1. Acesse a pagina inicial.
2. Informe o RE.
3. Se houver servico aberto, selecione e encerre.
4. Se nao houver servico aberto, preencha os dados do novo servico.
5. Ao finalizar a missao, acesse o encerramento.
6. Informe KM final e novidades.
7. Baixe o PDF, se necessario.

### Administrador

1. Acesse `/admin/login`.
2. Entre com e-mail e senha.
3. Acompanhe indicadores no dashboard.
4. Cadastre ou gerencie viaturas em `/admin/viaturas`.
5. Consulte relatorios em `/admin/relatorios`.
6. Baixe PDFs de relatorios encerrados quando necessario.
7. Use **Sair** para encerrar a sessao.

## 24. Referencias Internas

Arquivos mais importantes para manutencao:

- `prisma/schema.prisma`: estrutura do banco.
- `lib/actions/service.ts`: regras de abertura e encerramento de servico.
- `lib/actions/vehicle.ts`: regras administrativas de viaturas.
- `lib/actions/auth.ts`: login e logout.
- `lib/auth.ts`: sessao administrativa.
- `middleware.ts`: protecao de rotas admin.
- `lib/actions/reports.ts`: filtros de relatorios.
- `lib/reports/service-pdf.ts`: geracao do PDF.
- `components/forms/start-service-form.tsx`: fluxo principal do usuario.
- `components/forms/end-service-form.tsx`: encerramento de servico.
- `components/admin/vehicle-list.tsx`: acoes administrativas sobre viaturas.

