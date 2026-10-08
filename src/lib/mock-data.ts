export type DocStatus = "traité" | "en_cours" | "en_attente" | "erreur";
export type DocType = "Facture" | "Contrat" | "Rapport" | "CV" | "Courrier" | "Bon livraison" | "Certificat";

export interface MockDocument {
  id: string;
  title: string;
  type: DocType;
  author: string;
  department: string;
  size: string;
  tags: string[];
  status: DocStatus;
  updatedAt: string;
  favorite: boolean;
  pages: number;
}

export const documents: MockDocument[] = [
  { id: "DOC-10428", title: "Facture Orange — Novembre 2025", type: "Facture", author: "Sophie Martin", department: "Comptabilité", size: "1.2 Mo", tags: ["urgent", "télécom"], status: "traité", updatedAt: "2026-06-28T09:14:00", favorite: true, pages: 3 },
  { id: "DOC-10427", title: "Contrat cadre — Fournisseur Dupont SA", type: "Contrat", author: "Karim Benali", department: "Juridique", size: "3.8 Mo", tags: ["contrat", "2026"], status: "en_cours", updatedAt: "2026-06-28T08:02:00", favorite: false, pages: 24 },
  { id: "DOC-10426", title: "Rapport annuel 2025 — Direction", type: "Rapport", author: "Amélie Rousseau", department: "Direction", size: "8.4 Mo", tags: ["rapport", "annuel"], status: "traité", updatedAt: "2026-06-27T17:45:00", favorite: true, pages: 82 },
  { id: "DOC-10425", title: "CV — Camille Petit", type: "CV", author: "RH", department: "Ressources Humaines", size: "412 Ko", tags: ["recrutement"], status: "en_attente", updatedAt: "2026-06-27T14:22:00", favorite: false, pages: 2 },
  { id: "DOC-10424", title: "Bon de livraison BL-88213", type: "Bon livraison", author: "Logistique", department: "Logistique", size: "620 Ko", tags: ["livraison"], status: "traité", updatedAt: "2026-06-27T11:03:00", favorite: false, pages: 1 },
  { id: "DOC-10423", title: "Courrier — Réclamation client #4412", type: "Courrier", author: "Service Client", department: "Support", size: "310 Ko", tags: ["client", "réclamation"], status: "erreur", updatedAt: "2026-06-27T09:30:00", favorite: false, pages: 2 },
  { id: "DOC-10422", title: "Certificat ISO 27001", type: "Certificat", author: "Qualité", department: "Qualité", size: "1.9 Mo", tags: ["iso", "sécurité"], status: "traité", updatedAt: "2026-06-26T16:12:00", favorite: true, pages: 6 },
  { id: "DOC-10421", title: "Facture AWS — Juin 2026", type: "Facture", author: "Sophie Martin", department: "Comptabilité", size: "820 Ko", tags: ["cloud"], status: "en_cours", updatedAt: "2026-06-26T10:04:00", favorite: false, pages: 4 },
  { id: "DOC-10420", title: "Contrat de travail — Julie Fabre", type: "Contrat", author: "RH", department: "Ressources Humaines", size: "1.1 Mo", tags: ["rh", "cdi"], status: "traité", updatedAt: "2026-06-25T15:48:00", favorite: false, pages: 12 },
  { id: "DOC-10419", title: "Rapport audit sécurité Q2", type: "Rapport", author: "Karim Benali", department: "IT", size: "5.2 Mo", tags: ["audit", "sécurité"], status: "traité", updatedAt: "2026-06-25T09:20:00", favorite: true, pages: 34 },
  { id: "DOC-10418", title: "Courrier officiel — DGCCRF", type: "Courrier", author: "Juridique", department: "Juridique", size: "480 Ko", tags: ["officiel"], status: "en_attente", updatedAt: "2026-06-24T14:15:00", favorite: false, pages: 3 },
  { id: "DOC-10417", title: "Facture EDF — Site Lyon", type: "Facture", author: "Comptabilité", department: "Comptabilité", size: "290 Ko", tags: ["énergie"], status: "traité", updatedAt: "2026-06-24T08:50:00", favorite: false, pages: 2 },
];

export const uploadTrend = [
  { day: "Lun", uploads: 42, ocr: 38 },
  { day: "Mar", uploads: 58, ocr: 52 },
  { day: "Mer", uploads: 71, ocr: 64 },
  { day: "Jeu", uploads: 49, ocr: 47 },
  { day: "Ven", uploads: 86, ocr: 79 },
  { day: "Sam", uploads: 24, ocr: 22 },
  { day: "Dim", uploads: 18, ocr: 17 },
];

export const docsByType = [
  { name: "Factures", value: 4820, color: "var(--chart-1)" },
  { name: "Contrats", value: 1240, color: "var(--chart-2)" },
  { name: "Rapports", value: 890, color: "var(--chart-3)" },
  { name: "Courriers", value: 2310, color: "var(--chart-4)" },
  { name: "Autres", value: 1520, color: "var(--chart-5)" },
];

export const departmentUsage = [
  { dep: "Compta.", docs: 3120 },
  { dep: "Juridique", docs: 1840 },
  { dep: "RH", docs: 1520 },
  { dep: "IT", docs: 980 },
  { dep: "Direction", docs: 640 },
  { dep: "Logistique", docs: 2210 },
];

export const recentActivity = [
  { user: "Sophie Martin", action: "a validé", target: "Facture Orange — Nov. 2025", time: "il y a 4 min", initials: "SM" },
  { user: "Karim Benali", action: "a commenté", target: "Contrat cadre — Dupont SA", time: "il y a 22 min", initials: "KB" },
  { user: "Amélie Rousseau", action: "a partagé", target: "Rapport annuel 2025", time: "il y a 1 h", initials: "AR" },
  { user: "IA — Extraction", action: "a détecté un montant sur", target: "Facture AWS — Juin 2026", time: "il y a 2 h", initials: "IA" },
  { user: "Julie Fabre", action: "a téléversé", target: "3 nouveaux documents", time: "il y a 3 h", initials: "JF" },
];

export const notifications = [
  { title: "OCR terminé", detail: "12 documents traités avec succès", time: "il y a 5 min", level: "success" as const },
  { title: "Workflow en attente", detail: "Contrat Dupont SA — validation requise", time: "il y a 18 min", level: "warning" as const },
  { title: "Connexion suspecte", detail: "Nouvelle IP depuis Berlin", time: "il y a 1 h", level: "destructive" as const },
  { title: "Sauvegarde effectuée", detail: "Sauvegarde quotidienne complétée", time: "il y a 4 h", level: "info" as const },
];

export const tags = [
  { label: "urgent", count: 42 },
  { label: "2026", count: 128 },
  { label: "contrat", count: 96 },
  { label: "client", count: 214 },
  { label: "rh", count: 68 },
  { label: "audit", count: 33 },
  { label: "iso", count: 12 },
  { label: "cloud", count: 27 },
];

export const correspondents = [
  { name: "Orange SA", count: 84 },
  { name: "AWS", count: 42 },
  { name: "EDF", count: 61 },
  { name: "Dupont SA", count: 19 },
  { name: "DGCCRF", count: 7 },
];