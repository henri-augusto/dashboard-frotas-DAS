type AdminUserSummary = {
  id: string;
  email: string;
  createdAt: Date;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function AdminUserList({ admins }: { admins: AdminUserSummary[] }) {
  if (admins.length === 0) {
    return (
      <p className="rounded-2xl bg-panel/70 p-5 text-muted ring-1 ring-border/70">
        Nenhum administrador cadastrado.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {admins.map((admin) => (
        <article
          key={admin.id}
          className="rounded-2xl bg-panel/85 p-4 shadow-[0_14px_40px_rgba(60,42,30,0.08)] ring-1 ring-border/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(60,42,30,0.12)] sm:flex sm:items-center sm:justify-between sm:gap-4"
        >
          <div>
            <h3 className="text-base font-semibold tracking-tight text-primary">
              {admin.email}
            </h3>
            <p className="mt-1 text-sm text-muted">
              Cadastrado em {formatDate(admin.createdAt)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
