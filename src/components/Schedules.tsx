import { OPCIONES_PROGRAMAS, OPCIONES_SEDES } from "@/content/opciones";
import { SITE } from "@/content/site";
import SchedulesClient, { type BranchSchedule } from "./SchedulesClient";

// Los horarios vienen de la API pública del sistema de gestión (mcswim-admin).
// La home se regenera como mucho cada 60 s; si la API falla o tarda, la
// sección muestra un respaldo con WhatsApp en vez de romper la página.
const REVALIDATE_SECONDS = 60;
const TIMEOUT_MS = 4000;

// Última respuesta buena, en memoria del servidor. Si mcswim-admin se cae un
// momento (un reinicio o un deploy), la pizarra sigue con esos horarios en vez
// de cambiarse entera por el respaldo de WhatsApp. El respaldo solo sale si
// no hubo ninguna respuesta buena desde que arrancó el servidor.
let ultimosBuenos: BranchSchedule[] | null = null;

type ApiBranch = {
  id: number;
  name: string;
  address: string | null;
  notes: string | null;
  schedules: {
    day: string;
    time: string;
    ageGroup: string;
    category: string;
    notes: string | null;
    /** El personal marcó la clase como llena. Opcional: una API anterior no lo envía. */
    full?: boolean;
  }[];
};

async function fetchSchedules(): Promise<BranchSchedule[] | null> {
  const baseUrl = process.env.ADMIN_API_URL?.replace(/\/+$/, "");
  if (!baseUrl) {
    console.warn("[Schedules] ADMIN_API_URL no está definida; se muestra el respaldo.");
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/api/public/schedules`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data: { branches?: ApiBranch[] } = await response.json();
    if (!Array.isArray(data.branches)) throw new Error("Respuesta inesperada de la API");

    ultimosBuenos = data.branches.map((branch) => ({
      id: branch.id,
      name: branch.name,
      address: branch.address,
      notes: branch.notes,
      schedules: branch.schedules.map((s) => ({
        day: s.day,
        ageGroup: s.ageGroup,
        time: s.time,
        category: s.category,
        notes: s.notes,
        full: s.full ?? false,
      })),
    }));
    return ultimosBuenos;
  } catch (error) {
    console.error(
      `[Schedules] No se pudieron cargar los horarios${ultimosBuenos ? "; se muestran los últimos buenos" : ""}:`,
      error,
    );
    return ultimosBuenos;
  }
}

export default async function Schedules() {
  const branches = await fetchSchedules();
  return (
    <SchedulesClient
      branches={branches ?? []}
      unavailable={branches === null}
      whatsapp={SITE.whatsapp.numero}
      programas={OPCIONES_PROGRAMAS}
      sedes={OPCIONES_SEDES}
    />
  );
}
