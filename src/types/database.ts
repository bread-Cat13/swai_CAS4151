export interface LostItem {
  id: string;
  created_at: string;
  updated_at: string;
  item_name: string;
  description?: string;
  found_location: string;
  stored_location: string;
  found_date: string;
  status: "active" | "claimed" | "expired";
  finder_name?: string;
  contact_info?: string;
  image_url?: string; // 추가
}

export interface LostItemInsert {
  item_name: string;
  description?: string;
  found_location: string;
  stored_location: string;
  found_date: string;
  finder_name?: string;
  contact_info?: string;
  image_url?: string; // 추가
}

export interface LostItemUpdate {
  item_name?: string;
  description?: string;
  found_location?: string;
  stored_location?: string;
  found_date?: string;
  status?: "active" | "claimed" | "expired";
  finder_name?: string;
  contact_info?: string;
}

export type CampusType = "신촌" | "송도";

export interface Location {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  is_active: boolean;
  campus: string;
  created_at: string;
  updated_at: string;
}

export interface LostItem {
  id: string;
  created_at: string;
  updated_at: string;
  item_name: string;
  description?: string;
  found_location: string;
  stored_location: string;
  found_date: string;
  status: "active" | "claimed" | "expired";
  finder_name?: string;
  contact_info?: string;
}

export interface LostItemInsert {
  item_name: string;
  description?: string;
  found_location: string;
  stored_location: string;
  found_date: string;
  finder_name?: string;
  contact_info?: string;
}
