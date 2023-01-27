import { Repository } from "@core/app/repository";
import { Payment } from "@domain/payment/payment";

export interface PaymentRepository extends Repository<Payment> {}
