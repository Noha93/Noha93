/**
 * TypeScript Type Definitions
 * دليل العيادات - Clinic Directory
 */

// ===== ENUMS =====

export type Language = 'ar' | 'en';

export type UserRole = 'user' | 'doctor' | 'admin';

export type ClinicStatus = 'open' | 'closed' | 'busy';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';

export type DayOfWeek =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export type Specialization =
  | 'general'
  | 'cardiology'
  | 'dermatology'
  | 'dentistry'
  | 'orthopedics'
  | 'pediatrics'
  | 'gynecology'
  | 'ophthalmology'
  | 'neurology'
  | 'psychiatry'
  | 'urology'
  | 'ent'
  | 'gastroenterology'
  | 'endocrinology'
  | 'pulmonology'
  | 'nephrology'
  | 'oncology'
  | 'rheumatology'
  | 'surgery'
  | 'radiology'
  | 'physiotherapy';

// ===== LOCATION =====

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  area: string;
  city: string;
  country: string;
  coordinates: Coordinates;
  mapUrl?: string;
}

// ===== CONTACT =====

export interface ContactInfo {
  phone: string;          // Landline
  mobile: string;         // Mobile
  whatsapp?: string;
  email?: string;
  website?: string;
}

// ===== SCHEDULE =====

export interface DaySchedule {
  day: DayOfWeek;
  isWorking: boolean;
  startTime: string;  // "09:00"
  endTime: string;    // "17:00"
  breakStart?: string;
  breakEnd?: string;
  maxAppointments?: number;
}

export interface WeeklySchedule {
  [key: string]: DaySchedule;
}

// ===== EDUCATION =====

export interface Education {
  degree: string;
  institution: string;
  year: number;
  country: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: number;
  imageUrl?: string;
  verified: boolean;
}

// ===== MEDIA =====

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
  captionAr?: string;
}

// ===== REVIEW =====

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  doctorId: string;
  rating: number;        // 1-5
  comment: string;
  commentAr?: string;
  date: string;
  likes: number;
  isVerified: boolean;
}

// ===== ADVERTISEMENT =====

export interface Advertisement {
  id: string;
  doctorId?: string;
  hospitalId?: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  imageUrl: string;
  linkUrl?: string;
  type: 'banner' | 'featured' | 'spotlight';
  startDate: string;
  endDate: string;
  isActive: boolean;
  views: number;
  clicks: number;
}

// ===== DOCTOR =====

export interface Doctor {
  id: string;
  userId: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;        // "دكتور" / "دكتورة"
  titleEn: string;        // "Dr."
  specialization: Specialization;
  specializationAr: string;
  specializationEn: string;
  subSpecialization?: string;
  subSpecializationAr?: string;
  about: string;
  aboutAr: string;
  experience: number;     // years
  avatar: string;
  coverImage?: string;
  education: Education[];
  certificates: Certificate[];
  contact: ContactInfo;
  address: Address;
  schedule: DaySchedule[];
  clinicStatus: ClinicStatus;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  media: MediaItem[];
  consultationFee: number;
  currency: string;
  hospitalIds: string[];  // Associated hospitals
  isSubscribed: boolean;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiry?: string;
  isVerified: boolean;
  isFeatured: boolean;
  joinedDate: string;
  languages: string[];
  tags: string[];
}

// ===== HOSPITAL / MEDICAL CENTER =====

export interface Hospital {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'hospital' | 'medical_center' | 'clinic_complex';
  description: string;
  descriptionAr: string;
  logo: string;
  coverImage: string;
  contact: ContactInfo;
  address: Address;
  schedule: DaySchedule[];
  doctorIds: string[];
  specializations: Specialization[];
  facilities: string[];
  facilitiesAr: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  insuranceProviders: string[];
  isVerified: boolean;
  isFeatured: boolean;
  establishedYear: number;
  bedCount?: number;
}

// ===== APPOINTMENT =====

export interface TimeSlot {
  id: string;
  time: string;         // "10:00 AM"
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  userId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  notes?: string;
  type: 'in_person' | 'teleconsult';
  createdAt: string;
  fee: number;
  currency: string;
}

// ===== USER =====

export interface UserProfile {
  id: string;
  role: UserRole;
  nameAr: string;
  nameEn: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  bloodType?: string;
  medicalHistory?: string[];
  favoriteDoctor: string[];
  appointments: Appointment[];
  language: Language;
  createdAt: string;
}

// ===== DOCTOR DASHBOARD =====

export interface DoctorStats {
  totalAppointments: number;
  todayAppointments: number;
  weeklyAppointments: number;
  monthlyAppointments: number;
  totalPatients: number;
  newPatientsThisMonth: number;
  averageRating: number;
  totalReviews: number;
  profileViews: number;
  subscriptionStatus: SubscriptionPlan;
  revenueThisMonth: number;
  currency: string;
}

// ===== NAVIGATION TYPES =====

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Language: undefined;
  AuthSelection: undefined;
  UserLogin: undefined;
  DoctorLogin: undefined;
  UserRegister: undefined;
  DoctorRegister: undefined;
  UserApp: undefined;
  DoctorApp: undefined;
};

export type UserTabParamList = {
  Home: undefined;
  Search: undefined;
  Nearby: undefined;
  Hospitals: undefined;
  Profile: undefined;
};

export type DoctorTabParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  Profile: undefined;
  Documents: undefined;
  Subscription: undefined;
};

export type UserStackParamList = {
  Home: undefined;
  Search: { query?: string };
  Nearby: undefined;
  DoctorDetail: { doctorId: string };
  Booking: { doctorId: string; selectedDate?: string };
  Hospitals: undefined;
  HospitalDetail: { hospitalId: string };
  Reviews: { doctorId: string };
  MyAppointments: undefined;
  UserProfile: undefined;
  MapView: { doctorId?: string; hospitalId?: string };
  EditUserProfile: undefined;
  FavoriteDoctors: undefined;
  Notifications: undefined;
  AppointmentDetail: { appointmentId: string };
  HelpSupport: undefined;
  AboutApp: undefined;
};

export type DoctorStackParamList = {
  Dashboard: undefined;
  Appointments: undefined;
  AppointmentDetail: { appointmentId: string };
  ProfileEdit: undefined;
  Documents: undefined;
  Subscription: undefined;
  Advertisement: undefined;
  ClinicPhotos: undefined;
  WeeklySchedule: undefined;
  Earnings: undefined;
  DoctorNotifications: undefined;
  PatientProfile: { patientName?: string; patientPhone?: string };
  DoctorSettings: undefined;
  ProfilePreview: undefined;
};

// ===== FILTER / SEARCH =====

export interface SearchFilter {
  specialization?: Specialization;
  city?: string;
  area?: string;
  minRating?: number;
  maxFee?: number;
  availableToday?: boolean;
  acceptsInsurance?: boolean;
  language?: string;
  gender?: 'male' | 'female';
  openNow?: boolean;
  nearbyRadius?: number; // km
}

// ===== SUBSCRIPTION PLANS =====

export interface SubscriptionFeatures {
  plan: SubscriptionPlan;
  nameAr: string;
  nameEn: string;
  price: number;
  currency: string;
  period: 'monthly' | 'yearly';
  features: string[];
  featuresAr: string[];
  maxPhotos: number;
  maxVideos: number;
  canAdvertise: boolean;
  isFeatured: boolean;
  analyticsAccess: boolean;
}
