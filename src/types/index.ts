export interface SensorData {
  id?: number;
  suhu: number;
  kelembapan: number;
  timestamp?: string;
}

export interface ApiAsapData {
  id?: number;
  api_value: number;
  asap_value: number;
  timestamp?: string;
}

export interface ListrikData {
  id?: number;
  phase_r: number;
  phase_s: number;
  phase_t: number;
  current_r: number;
  current_s: number;
  current_t: number;
  power_r: number;
  power_s: number;
  power_t: number;
  energy_r: number;
  energy_s: number;
  energy_t: number;
  frequency_r: number;
  frequency_s: number;
  frequency_t: number;
  pf_r: number;
  pf_s: number;
  pf_t: number;
  va_r: number;
  va_s: number;
  va_t: number;
  var_r: number;
  var_s: number;
  var_t: number;
  voltage_3ph: number;
  current_3ph: number;
  power_3ph: number;
  energy_3ph: number;
  frequency_3ph: number;
  pf_3ph: number;
  va_3ph: number;
  var_3ph: number;
  timestamp?: string;
}

export interface User {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}