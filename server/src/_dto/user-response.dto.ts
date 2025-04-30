// user-response._dto.ts
import { Exclude } from 'class-transformer';

export class UserResponseDTO {
  @Exclude() // Исключаем это поле из ответа
  createdAt: string;

  firstName: string;
  lastName: string;
  @Exclude() // Исключаем это поле из ответа
  id: string;
  phone: string;
  photoUrl: string;
  role: string;
  username: string;
}
