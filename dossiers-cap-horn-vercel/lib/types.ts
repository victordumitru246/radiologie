export type RadiologyCase = {
  id: string;
  title: string;
  indication: string | null;
  clinical_context: string | null;
  final_diagnosis: string | null;
  differential_diagnosis: string | null;
  modality: string | null;
  anatomical_region: string | null;
  educational_score: number | null;
  tags: string[] | null;
  diagnostic_pitfalls: string | null;
  key_learning_points: string | null;
  report_text: string | null;
  references_text: string | null;
  status: "brouillon" | "publie" | "archive";
  pseudonymized_patient_id: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export type DicomFile = {
  id: string;
  case_id: string;
  file_name: string;
  storage_path: string;
  file_size: number | null;
  metadata_warning: boolean | null;
  uploaded_by: string | null;
  created_at: string;
};
