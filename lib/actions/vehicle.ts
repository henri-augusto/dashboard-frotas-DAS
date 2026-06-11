export { getAllVehicles, getDashboardStats } from "./vehicle-queries";
export type { DashboardStats } from "./types";

export {
  createVehicle,
  updateVehicleStatus,
  dischargeVehicle,
  revertVehicleDischarge,
} from "./vehicle-mutations";
