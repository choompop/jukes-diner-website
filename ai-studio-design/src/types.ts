export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'main' | 'sides' | 'drinks' | 'sweets';
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  hours: string;
  lat: number;
  lng: number;
}

export interface User {
  username: string;
  role: 'admin' | 'staff';
}

export interface BrainDump {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}
