export interface BaseEntity {
  id: string;
  createdAt: number;
}

export interface TimestampedEntity {
  createdAt: number;
  updatedAt: number;
}
