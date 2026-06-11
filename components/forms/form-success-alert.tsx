export function FormSuccessAlert({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-[#bdd2b7] bg-[#e6efe2] px-3.5 py-3 text-sm font-medium text-[#385f36]">
      {message}
    </div>
  );
}
