import { CreateCardDTO } from "@modules/cards/dtos/create-card.dto";

export type CreateCardBody = Omit<CreateCardDTO, "apiKey">;
