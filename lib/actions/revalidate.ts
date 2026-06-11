import { revalidatePath } from "next/cache";

export function revalidateFleetPaths() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/viaturas");
}

export function revalidateServicePaths() {
  revalidatePath("/");
  revalidatePath("/admin");
}
