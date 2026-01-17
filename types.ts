
export enum InspectionStatus {
  CONFORME = 'Conforme',
  NAO_CONFORME = 'Não Conforme'
}

export interface Area {
  id: string;
  name: string;
}

export interface Condominium {
  id: string;
  name: string;
  address: string;
  tower?: string;
  notes?: string;
  areas: Area[];
}

export interface AreaInspection {
  areaId: string;
  areaName: string;
  status: InspectionStatus;
  notes: string;
  photos: string[]; // base64 strings
}

export interface Inspection {
  id: string;
  condominiumId: string;
  condominiumName: string;
  date: string;
  inspector: string;
  areas: AreaInspection[];
}
