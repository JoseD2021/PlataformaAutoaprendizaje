export interface ScheduleModel {
  days: string;
  hours: string;
}

export interface RoomInfoModel {
  schedules: ScheduleModel[];
  rules: string[];
}